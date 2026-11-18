import { CardState, SavedLook } from '../types';

export const LS_KEY = 'lyric-card-settings-v1';
export const RECENT_KEY = 'lyric-card-recent-v1';
export const LOOKS_KEY = 'lyric-card-looks-v1';

export function saveSettings(state: CardState) {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        color: state.color,
        theme: state.theme,
        align: state.align,
        fmt: state.fmt,
        glare: state.glare,
        glareStyle: state.glareStyle,
        cardDepth: state.cardDepth,
        hide: state.hide,
        autoFit: state.autoFit,
        size: state.lyricSize,
        scale: state.scale,
        coverShape: state.coverShape,
        lyricFont: state.lyricFont,
        bgStyle: state.bgStyle,
        glareAuto: state.glareAuto,
        autoColor: state.autoColor,
        layoutKey: state.layoutKey,
      })
    );
  } catch (e) {
    // Storage quota or blocked
  }
}

export function loadSettings(): Partial<CardState> {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!d) return {};
    return d;
  } catch (e) {
    return {};
  }
}

export function getRecentSearches(): string[] {
  try {
    const a = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(a)
      ? a.filter((x) => typeof x === 'string').slice(0, 6)
      : [];
  } catch (e) {
    return [];
  }
}

export function addRecentSearch(q: string): string[] {
  if (!q.trim()) return getRecentSearches();
  const current = getRecentSearches();
  const next = [
    q.trim(),
    ...current.filter((x) => x.toLowerCase() !== q.trim().toLowerCase()),
  ].slice(0, 6);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch (e) {}
  return next;
}

export function clearRecentSearches(): string[] {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch (e) {}
  return [];
}

export function getSavedLooks(): SavedLook[] {
  try {
    const a = JSON.parse(localStorage.getItem(LOOKS_KEY) || '[]');
    return Array.isArray(a)
      ? a.filter((x) => x && typeof x.name === 'string' && x.look).slice(0, 12)
      : [];
  } catch (e) {
    return [];
  }
}

export function saveLook(name: string, look: any): SavedLook[] {
  const current = getSavedLooks();
  const filtered = current.filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase()
  );
  const next: SavedLook[] = [{ name, look }, ...filtered].slice(0, 12);
  try {
    localStorage.setItem(LOOKS_KEY, JSON.stringify(next));
  } catch (e) {}
  return next;
}

export function deleteLook(index: number): SavedLook[] {
  const current = getSavedLooks();
  current.splice(index, 1);
  try {
    localStorage.setItem(LOOKS_KEY, JSON.stringify(current));
  } catch (e) {}
  return current;
}

export function encodeLookHash(obj: any): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeLookHash(hash: string): any {
  return JSON.parse(
    decodeURIComponent(escape(atob(hash.replace(/-/g, '+').replace(/_/g, '/'))))
  );
}
