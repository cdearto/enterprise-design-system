// Reads the theming rules out of components/_shared/tokens.css and resolves
// them the way a browser does: for one mode and one accent, apply every rule
// that matches in cascade order (specificity, then source order), substitute
// var() references, and evaluate what is left into typed values.
//
// Only the rules that define custom properties on :root, [data-mode] and
// [data-accent] are read; component rules scoped to a mode are not tokens.

import type { Oklch } from './color.ts';

export const MODES = ['light', 'dim', 'dark', 'hc'] as const;
export const ACCENTS = ['blue', 'indigo', 'teal', 'violet', 'amber', 'slate'] as const;
export type Mode = (typeof MODES)[number];
export type Accent = (typeof ACCENTS)[number];

interface Condition { mode?: string; accent?: string }
interface Rule { conditions: Condition[]; specificity: number; order: number; decls: Map<string, string> }

export type Value =
  | { type: 'color'; color: Oklch }
  | { type: 'dimension'; px: number }
  | { type: 'number'; n: number }
  | { type: 'shadow'; layers: ShadowLayer[] };

export interface ShadowLayer { offsetX: number; offsetY: number; blur: number; spread: number; color: Oklch }

const THEMING_SELECTOR = /^(:root|(\[data-(mode|accent)="[a-z]+"\]\s*)+)(,\s*(\[data-(mode|accent)="[a-z]+"\]\s*)+)*$/;

/** The rules that define tokens, in source order. */
export function readRules(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  const block = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = block.exec(text))) {
    const selector = (m[1] ?? '').trim().replace(/\s+/g, ' ');
    const body = m[2] ?? '';
    if (!THEMING_SELECTOR.test(selector) || !/--[\w-]+\s*:/.test(body)) continue;
    const decls = new Map<string, string>();
    for (const d of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      decls.set(d[1] as string, (d[2] as string).trim().replace(/\s+/g, ' '));
    }
    const conditions = selector.split(',').map((part): Condition => {
      const c: Condition = {};
      for (const a of part.matchAll(/\[data-(mode|accent)="([a-z]+)"\]/g)) c[a[1] as 'mode' | 'accent'] = a[2] as string;
      return c;
    });
    const specificity = selector === ':root' ? 1 : Math.max(...conditions.map((c) => Object.keys(c).length));
    rules.push({ conditions, specificity, order: rules.length, decls });
  }
  return rules;
}

/** The declared value of every token for one mode and accent, before evaluation. */
export function cascade(rules: Rule[], mode: Mode, accent: Accent): Map<string, string> {
  const matches = (c: Condition): boolean =>
    (c.mode === undefined || c.mode === mode) && (c.accent === undefined || c.accent === accent);
  // :root has no conditions, so it matches every mode and accent.
  const applied = rules
    .filter((r) => r.conditions.some(matches))
    .sort((a, b) => a.specificity - b.specificity || a.order - b.order);
  const out = new Map<string, string>();
  for (const r of applied) for (const [k, v] of r.decls) out.set(k, v);
  return out;
}

/** Replaces var(--x) and var(--x, fallback) with the resolved text. */
function substitute(text: string, declared: Map<string, string>, depth = 0): string {
  if (depth > 10) throw new Error('var() cycle in: ' + text);
  const out = text.replace(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/g, (_, name: string, fallback?: string) => {
    const v = declared.get(name) ?? fallback;
    if (v === undefined) throw new Error('Undefined ' + name);
    return substitute(v.trim(), declared, depth + 1);
  });
  return out;
}

/** Splits at commas that are not inside parentheses. */
function splitTopLevel(text: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && (sep === ' ' ? /\s/.test(ch ?? '') : ch === sep)) {
      if (i > start) parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  if (start < text.length) parts.push(text.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

function evalCalc(text: string): number {
  const t = text.trim();
  const calc = /^calc\(\s*([\d.]+)%\s*\*\s*([\d.]+)\s*\)$/.exec(t);
  if (calc) return (Number(calc[1]) * Number(calc[2])) / 100;
  const pct = /^([\d.]+)%$/.exec(t);
  if (pct) return Number(pct[1]) / 100;
  throw new Error('Unsupported percentage: ' + text);
}

export function parseColor(text: string): Oklch {
  const t = text.trim();
  const ok = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)$/.exec(t);
  if (ok) return { l: Number(ok[1]) / 100, c: Number(ok[2]), h: Number(ok[3]), alpha: ok[4] === undefined ? 1 : Number(ok[4]) };
  // color-mix(in oklch, <color> <p>, transparent): the color, at alpha p.
  // Interpolating toward transparent takes the color's own L, C and h.
  const mix = /^color-mix\(\s*in oklch\s*,(.*),\s*transparent\s*\)$/.exec(t);
  if (mix) {
    const parts = splitTopLevel(mix[1] ?? '', ' ');
    const pct = parts.pop();
    const base = parseColor(parts.join(' '));
    return { ...base, alpha: base.alpha * evalCalc(pct ?? '') };
  }
  throw new Error('Unsupported color: ' + text);
}

function parseLength(text: string): number {
  if (text === '0') return 0;
  const m = /^([\d.]+)px$/.exec(text);
  if (!m) throw new Error('Unsupported length: ' + text);
  return Number(m[1]);
}

function parseShadow(text: string): ShadowLayer[] {
  return splitTopLevel(text, ',').map((layer) => {
    const parts = splitTopLevel(layer, ' ');
    const color = parts.pop();
    const lengths = parts.map(parseLength);
    if (lengths.length < 2 || lengths.length > 4 || color === undefined) throw new Error('Unsupported shadow: ' + layer);
    const [offsetX = 0, offsetY = 0, blur = 0, spread = 0] = lengths;
    return { offsetX, offsetY, blur, spread, color: parseColor(color) };
  });
}

/** Evaluates one token's resolved text into a typed value. */
export function evaluate(name: string, declared: Map<string, string>): Value {
  const text = substitute(declared.get(name) ?? '', declared);
  if (/^-?[\d.]+$/.test(text)) return { type: 'number', n: Number(text) };
  if (/^[\d.]+px$/.test(text)) return { type: 'dimension', px: parseLength(text) };
  if (/^(oklch|color-mix)\(/.test(text)) return { type: 'color', color: parseColor(text) };
  return { type: 'shadow', layers: parseShadow(text) };
}
