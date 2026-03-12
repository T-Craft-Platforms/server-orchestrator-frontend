const namespacePalettes = [
  {
    start: 'rgba(56, 189, 248, 0.85)',
    end: 'rgba(37, 99, 235, 0.9)',
    glow: 'rgba(125, 211, 252, 0.45)',
    accent: 'rgba(14, 165, 233, 0.6)',
  },
  {
    start: 'rgba(74, 222, 128, 0.82)',
    end: 'rgba(22, 163, 74, 0.9)',
    glow: 'rgba(134, 239, 172, 0.42)',
    accent: 'rgba(16, 185, 129, 0.6)',
  },
  {
    start: 'rgba(244, 114, 182, 0.8)',
    end: 'rgba(168, 85, 247, 0.9)',
    glow: 'rgba(249, 168, 212, 0.42)',
    accent: 'rgba(217, 70, 239, 0.58)',
  },
  {
    start: 'rgba(251, 191, 36, 0.82)',
    end: 'rgba(245, 158, 11, 0.9)',
    glow: 'rgba(253, 224, 71, 0.4)',
    accent: 'rgba(251, 146, 60, 0.62)',
  },
  {
    start: 'rgba(45, 212, 191, 0.82)',
    end: 'rgba(8, 145, 178, 0.9)',
    glow: 'rgba(94, 234, 212, 0.45)',
    accent: 'rgba(20, 184, 166, 0.58)',
  },
];

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function hashNamespace(namespaceId: string) {
  return namespaceId.split('').reduce((acc, char) => ((acc * 33) ^ char.charCodeAt(0)) >>> 0, 5381);
}

function normalizeHexColor(value?: string) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!HEX_COLOR_PATTERN.test(normalized)) {
    return null;
  }

  if (normalized.length === 4) {
    const [_, r, g, b] = normalized;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return normalized.toLowerCase();
}

function toRgb(hex: string) {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function toRgba(hex: string, alpha: number) {
  const rgb = toRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function mixHex(hexA: string, hexB: string, ratio: number) {
  const a = toRgb(hexA);
  const b = toRgb(hexB);
  const clampRatio = Math.max(0, Math.min(1, ratio));
  const mixChannel = (aChannel: number, bChannel: number) => (
    Math.round(aChannel * (1 - clampRatio) + bChannel * clampRatio)
  );

  return {
    r: mixChannel(a.r, b.r),
    g: mixChannel(a.g, b.g),
    b: mixChannel(a.b, b.b),
  };
}

function toRgbaFromRgb(rgb: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function createAccentPalette(accentColor: string) {
  const lighter = mixHex(accentColor, '#ffffff', 0.25);
  const darker = mixHex(accentColor, '#020617', 0.4);
  return {
    start: toRgbaFromRgb(lighter, 0.85),
    end: toRgbaFromRgb(darker, 0.92),
    glow: toRgbaFromRgb(lighter, 0.45),
    accent: toRgba(accentColor, 0.6),
  };
}

function escapeBackgroundUrl(url: string) {
  return url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export interface NamespaceVisualInput {
  id: string;
  coverImage?: string;
  accentColor?: string;
}

export interface NamespaceVisual {
  cardImage: string;
  pageBackdrop: string;
  accent: string;
  glow: string;
}

export function getNamespaceVisual(namespace: NamespaceVisualInput | string): NamespaceVisual {
  const namespaceId = typeof namespace === 'string' ? namespace : namespace.id;
  const accentColor = typeof namespace === 'string' ? undefined : namespace.accentColor;
  const coverImage = typeof namespace === 'string' ? undefined : namespace.coverImage?.trim();
  const seed = hashNamespace(namespaceId);
  const normalizedAccentColor = normalizeHexColor(accentColor);
  const palette = normalizedAccentColor
    ? createAccentPalette(normalizedAccentColor)
    : namespacePalettes[seed % namespacePalettes.length];
  const focusX = 20 + (seed % 60);
  const focusY = 18 + ((seed >> 3) % 48);
  const angle = 115 + (seed % 50);
  const escapedCoverImage = coverImage ? escapeBackgroundUrl(coverImage) : null;

  if (escapedCoverImage) {
    return {
      cardImage: `
        radial-gradient(circle at ${focusX}% ${focusY}%, ${palette.glow} 0%, rgba(15, 23, 42, 0) 42%),
        radial-gradient(circle at ${100 - focusX}% ${100 - focusY}%, ${palette.accent} 0%, rgba(15, 23, 42, 0) 36%),
        linear-gradient(155deg, rgba(2, 6, 23, 0.15) 0%, rgba(2, 6, 23, 0.72) 100%),
        url("${escapedCoverImage}")
      `,
      pageBackdrop: `
        radial-gradient(circle at ${focusX}% ${focusY}%, ${palette.glow} 0%, rgba(2, 6, 23, 0) 52%),
        radial-gradient(circle at ${100 - focusX}% ${100 - focusY}%, ${palette.accent} 0%, rgba(2, 6, 23, 0) 40%),
        linear-gradient(165deg, rgba(2, 6, 23, 0.78) 0%, rgba(2, 6, 23, 0.92) 100%),
        url("${escapedCoverImage}")
      `,
      accent: palette.accent,
      glow: palette.glow,
    };
  }

  return {
    cardImage: `
      radial-gradient(circle at ${focusX}% ${focusY}%, ${palette.glow} 0%, rgba(15, 23, 42, 0) 46%),
      radial-gradient(circle at ${100 - focusX}% ${100 - focusY}%, ${palette.accent} 0%, rgba(15, 23, 42, 0) 44%),
      linear-gradient(${angle}deg, ${palette.start} 0%, ${palette.end} 100%)
    `,
    pageBackdrop: `
      radial-gradient(circle at ${focusX}% ${focusY}%, ${palette.glow} 0%, rgba(2, 6, 23, 0) 48%),
      radial-gradient(circle at ${100 - focusX}% ${100 - focusY}%, ${palette.accent} 0%, rgba(2, 6, 23, 0) 40%),
      linear-gradient(${angle}deg, rgba(15, 23, 42, 0.78) 0%, rgba(2, 6, 23, 0.92) 100%)
    `,
    accent: palette.accent,
    glow: palette.glow,
  };
}
