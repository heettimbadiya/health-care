/**
 * Theme utility functions
 * Helper functions to access and transform theme values
 */

import { theme } from './index';

/**
 * Get a color value from the theme
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let value: any = theme.colors;
  
  for (const part of parts) {
    value = value[part];
    if (!value) {
      console.warn(`Color path "${path}" not found in theme`);
      return theme.colors.gray[500];
    }
  }
  
  return value;
}

/**
 * Get a spacing value from the theme
 */
export function getSpacing(size: keyof typeof theme.spacing): string {
  return theme.spacing[size];
}

/**
 * Get a shadow value from the theme
 */
export function getShadow(size: keyof typeof theme.shadows): string {
  return theme.shadows[size];
}

/**
 * Get a border radius value from the theme
 */
export function getBorderRadius(size: keyof typeof theme.borderRadius): string {
  return theme.borderRadius[size];
}

/**
 * Get a typography value from the theme
 */
export function getFontSize(size: keyof typeof theme.typography.fontSize): string {
  return theme.typography.fontSize[size];
}

/**
 * Convert theme object to CSS custom properties string
 */
export function themeToCssVars(): string {
  const colors = Object.entries(theme.colors).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([shade, color]) => {
        acc[`--color-${key}-${shade}`] = String(color);
      });
    }
    return acc;
  }, {} as Record<string, string>);

  return Object.entries(colors)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}

