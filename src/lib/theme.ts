import type { SiteConfig } from '../config/schema';

/** Font keys → CSS family names (all fonts are OFL licensed, self-hosted via
 *  @fontsource; only the families actually used are downloaded by browsers). */
export const FONT_FAMILIES: Record<string, string> = {
  geist: "'Geist Variable', 'Geist', system-ui, sans-serif",
  inter: "'Inter Variable', 'Inter', system-ui, sans-serif",
  manrope: "'Manrope Variable', 'Manrope', system-ui, sans-serif",
  'space-grotesk': "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
  'ibm-plex-sans': "'IBM Plex Sans', system-ui, sans-serif",
  'ibm-plex-mono': "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

const RADIUS = {
  none: { s: '0px', m: '0px', l: '0px' },
  soft: { s: '4px', m: '6px', l: '10px' },
  round: { s: '10px', m: '18px', l: '28px' },
};
const BUTTON_RADIUS = { pill: '999px', square: '0px', soft: '8px' };

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** Build the :root CSS variables block from the theme config. */
export function themeVars(theme: SiteConfig['theme']): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(theme.colors)) vars.push(`--c-${kebab(k)}:${v}`);
  vars.push(`--font-display:${FONT_FAMILIES[theme.fonts.display]}`);
  vars.push(`--font-body:${FONT_FAMILIES[theme.fonts.body]}`);
  vars.push(`--font-mono:${FONT_FAMILIES[theme.fonts.mono]}`);
  vars.push(`--display-weight:${theme.type.displayWeight}`);
  vars.push(`--display-tracking:${theme.type.displayTracking}`);
  vars.push(`--eyebrow-transform:${theme.type.uppercaseEyebrows ? 'uppercase' : 'none'}`);
  const r = RADIUS[theme.radius];
  vars.push(`--r-s:${r.s}`, `--r-m:${r.m}`, `--r-l:${r.l}`, `--r-btn:${BUTTON_RADIUS[theme.buttons]}`);
  return `:root{${vars.join(';')}}`;
}
