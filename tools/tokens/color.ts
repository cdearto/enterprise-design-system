// OKLCH to sRGB, for the hex fallback the DTCG color format carries and for
// tools that read hex only. Out-of-gamut colors are mapped the way CSS Color
// 4 maps them: reduce chroma at constant lightness and hue until the clipped
// color is within a just-noticeable difference.

export interface Oklch { l: number; c: number; h: number; alpha: number }

type Rgb = [number, number, number];

function oklchToLinearSrgb({ l, c, h }: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

function linearSrgbToOklab([r, g, b]: Rgb): Rgb {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const encode = (x: number): number => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const decode = (x: number): number => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const clip01 = (x: number): number => Math.min(1, Math.max(0, x));

function inGamut(rgb: Rgb): boolean {
  return rgb.every((x) => x >= -1e-6 && x <= 1 + 1e-6);
}

function deltaEOK(a: Rgb, b: Rgb): number {
  const [l1, a1, b1] = linearSrgbToOklab(a.map(decode) as Rgb);
  const [l2, a2, b2] = linearSrgbToOklab(b.map(decode) as Rgb);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/** Gamma-encoded sRGB in 0..1, gamut-mapped per CSS Color 4. */
export function oklchToSrgb(color: Oklch): Rgb {
  if (color.l >= 1) return [1, 1, 1];
  if (color.l <= 0) return [0, 0, 0];
  const at = (c: number): Rgb => oklchToLinearSrgb({ ...color, c }).map(encode) as Rgb;
  const exact = at(color.c);
  if (inGamut(exact)) return exact.map(clip01) as Rgb;
  const JND = 0.02;
  const EPSILON = 0.0001;
  let lo = 0;
  let hi = color.c;
  let loInGamut = true;
  while (hi - lo > EPSILON) {
    const mid = (lo + hi) / 2;
    const current = at(mid);
    if (loInGamut && inGamut(current)) { lo = mid; continue; }
    const clipped = current.map(clip01) as Rgb;
    const e = deltaEOK(clipped, current);
    if (e < JND) {
      if (JND - e < EPSILON) return clipped;
      loInGamut = false;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return at(lo).map(clip01) as Rgb;
}

/** True when the color needed gamut mapping to fit sRGB. */
export function outOfSrgb(color: Oklch): boolean {
  if (color.l >= 1 || color.l <= 0) return false;
  return !inGamut(oklchToLinearSrgb(color).map(encode) as Rgb);
}

const byte = (x: number): string => Math.round(clip01(x) * 255).toString(16).padStart(2, '0');

/** #rrggbb, ignoring alpha (the DTCG hex fallback carries no alpha). */
export function toHex(color: Oklch): string {
  return '#' + oklchToSrgb(color).map(byte).join('');
}

/** #rrggbb, or #rrggbbaa when the color is not opaque. */
export function toHexWithAlpha(color: Oklch): string {
  return toHex(color) + (color.alpha < 1 ? byte(color.alpha) : '');
}
