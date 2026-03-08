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

function hashNamespace(namespaceId: string) {
  return namespaceId.split('').reduce((acc, char) => ((acc * 33) ^ char.charCodeAt(0)) >>> 0, 5381);
}

export interface NamespaceVisual {
  cardImage: string;
  pageBackdrop: string;
  accent: string;
  glow: string;
}

export function getNamespaceVisual(namespaceId: string): NamespaceVisual {
  const seed = hashNamespace(namespaceId);
  const palette = namespacePalettes[seed % namespacePalettes.length];
  const focusX = 20 + (seed % 60);
  const focusY = 18 + ((seed >> 3) % 48);
  const angle = 115 + (seed % 50);

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
