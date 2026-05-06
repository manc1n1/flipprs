const WIKI_IMAGE_BASE = 'https://oldschool.runescape.wiki/images/';

export function buildIconUrl(icon: string | undefined): string | undefined {
  if (!icon) return undefined;
  return `${WIKI_IMAGE_BASE}${icon}`;
}
