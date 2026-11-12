// Generates the design tokens from components/_shared/tokens.css, the single
// source of truth. Run with `npm run tokens`; CI fails when the committed
// files differ from a fresh run.
//
//   tokens/modes/<mode>.tokens.json            every token, one mode, blue accent
//   tokens/accents/<accent>/<mode>.tokens.json  what an accent changes in a mode
//   tokens/tokens-studio.json                   the four modes as Tokens Studio
//                                               sets and themes, for Figma
//
// The .tokens.json files follow the W3C Design Tokens Format (DTCG 2025.10):
// colors keep their exact OKLCH components with a hex fallback; dimensions,
// shadows and numbers use the format's own types.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toHex, toHexWithAlpha, type Oklch } from './color.ts';
import { ACCENTS, MODES, cascade, evaluate, readRules, type Accent, type Mode, type ShadowLayer, type Value } from './css.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SOURCE = 'components/_shared/tokens.css';
const VENDOR = 'com.doselos.eds';

const MODE_NAMES: Record<Mode, string> = { light: 'Light', dim: 'Dim', dark: 'Dark', hc: 'High contrast' };

/** Where a CSS custom property lives in the token tree: [group, name]. */
function place(cssName: string, value: Value): [string, string] {
  const bare = cssName.slice(2);
  switch (value.type) {
    case 'color': return ['color', bare];
    case 'shadow': return ['shadow', bare.replace(/^shadow-/, '')];
    case 'dimension': return [bare.split('-')[0] ?? bare, bare.split('-').slice(1).join('-') || bare];
    case 'number': return ['number', bare];
  }
}

const round = (n: number, places: number): number => Number(n.toFixed(places));

/* ---------- DTCG 2025.10 ---------- */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function dtcgColor(c: Oklch): Json {
  const value: { [k: string]: Json } = { colorSpace: 'oklch', components: [round(c.l, 4), round(c.c, 4), round(c.h, 2)] };
  if (c.alpha < 1) value['alpha'] = round(c.alpha, 4);
  value['hex'] = toHex(c);
  return value;
}
const dtcgPx = (px: number): Json => ({ value: px, unit: 'px' });
function dtcgShadowLayer(s: ShadowLayer): Json {
  return { color: dtcgColor(s.color), offsetX: dtcgPx(s.offsetX), offsetY: dtcgPx(s.offsetY), blur: dtcgPx(s.blur), spread: dtcgPx(s.spread) };
}

function dtcgToken(cssName: string, value: Value): Json {
  const css = { [VENDOR]: { css: cssName } };
  switch (value.type) {
    case 'color': return { $type: 'color', $value: dtcgColor(value.color), $extensions: css };
    case 'dimension': return { $type: 'dimension', $value: dtcgPx(value.px), $extensions: css };
    case 'number': return { $type: 'number', $value: value.n, $extensions: css };
    case 'shadow': {
      const layers = value.layers.map(dtcgShadowLayer);
      return { $type: 'shadow', $value: layers.length === 1 ? (layers[0] as Json) : layers, $extensions: css };
    }
  }
}

/* ---------- Tokens Studio ---------- */

const studioPx = (px: number): string => String(px);
function studioToken(value: Value): Json {
  switch (value.type) {
    case 'color': return { $type: 'color', $value: toHexWithAlpha(value.color) };
    case 'dimension': return { $type: 'borderRadius', $value: value.px + 'px' };
    case 'number': return { $type: 'number', $value: value.n };
    case 'shadow': return {
      $type: 'boxShadow',
      $value: value.layers.map((s) => ({ x: studioPx(s.offsetX), y: studioPx(s.offsetY), blur: studioPx(s.blur), spread: studioPx(s.spread), color: toHexWithAlpha(s.color), type: 'dropShadow' })),
    };
  }
}

/* ---------- build ---------- */

type Tokens = Map<string, Value>;

function resolveAll(mode: Mode, accent: Accent, rules: ReturnType<typeof readRules>, names: string[]): Tokens {
  const declared = cascade(rules, mode, accent);
  return new Map(names.map((n) => [n, evaluate(n, declared)]));
}

function tree(tokens: Tokens, token: (cssName: string, v: Value) => Json): { [k: string]: { [k: string]: Json } } {
  const out: { [k: string]: { [k: string]: Json } } = {};
  for (const [cssName, value] of tokens) {
    const [group, name] = place(cssName, value);
    (out[group] ??= {})[name] = token(cssName, value);
  }
  return out;
}

function write(path: string, data: Json): void {
  const file = join(ROOT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

const rules = readRules(readFileSync(join(ROOT, SOURCE), 'utf8'));
const base = rules[0];
if (!base || base.specificity !== 1) throw new Error(SOURCE + ' must open its theming with the :root tokens');
const names = [...base.decls.keys()];

rmSync(join(ROOT, 'tokens'), { recursive: true, force: true });
const studio: { [k: string]: Json } = {};
let files = 0;
for (const mode of MODES) {
  const blue = resolveAll(mode, 'blue', rules, names);
  write(`tokens/modes/${mode}.tokens.json`, {
    $description: `Enterprise Design System, ${MODE_NAMES[mode].toLowerCase()} mode, blue accent. Generated from ${SOURCE}; edit the CSS, not this file.`,
    ...tree(blue, dtcgToken),
  });
  files++;
  studio[mode] = tree(blue, (_, v) => studioToken(v));
  for (const accent of ACCENTS.filter((a) => a !== 'blue')) {
    const changed: Tokens = new Map([...resolveAll(mode, accent, rules, names)]
      .filter(([n, v]) => JSON.stringify(v) !== JSON.stringify(blue.get(n))));
    write(`tokens/accents/${accent}/${mode}.tokens.json`, {
      $description: `The ${accent} accent in ${MODE_NAMES[mode].toLowerCase()} mode: the tokens it changes from modes/${mode}.tokens.json. Generated from ${SOURCE}.`,
      ...tree(changed, dtcgToken),
    });
    files++;
  }
}
studio['$themes'] = MODES.map((m) => ({ id: m, name: MODE_NAMES[m], group: 'Mode', selectedTokenSets: { [m]: 'enabled' } }));
studio['$metadata'] = { tokenSetOrder: [...MODES] };
write('tokens/tokens-studio.json', studio);
files++;
console.log(`${names.length} tokens, ${MODES.length} modes, ${ACCENTS.length - 1} accents: wrote ${files} files to tokens/`);
