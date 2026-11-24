// OKLCH to sRGB hex, for the fallback the DTCG color format carries and for
// tools that read hex only. A color outside sRGB is clipped channel by channel.
// For every color tokens.css defines, that gives the same hex as CSS Color 4's
// chroma-reducing gamut mapping, without the extra machinery.

export interface Oklch { l: number; c: number; h: number; alpha: number }

const encode = (x: number): number => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const byte = (x: number): string => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0');

/** Gamma-encoded sRGB, each channel 0..1 once clipped. */
export function oklchToSrgb({ l, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    encode(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    encode(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    encode(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
  ];
}

/** #rrggbb, ignoring alpha (the DTCG hex fallback carries no alpha). */
export function toHex(color: Oklch): string {
  return '#' + oklchToSrgb(color).map(byte).join('');
}

/** #rrggbb, or #rrggbbaa when the color is not opaque. */
export function toHexWithAlpha(color: Oklch): string {
  return toHex(color) + (color.alpha < 1 ? byte(color.alpha) : '');
}
