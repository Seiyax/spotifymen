import { fetchJson, SearchError } from './musicSearch';

export const LYRICS_API = 'https://api.lyrics.ovh/v1';
export const LRCLIB_API = 'https://lrclib.net/api';
export const LYRICS_TIMEOUT = 6000;
export const LINES_PER_BLOCK = 1;
export const MAX_LINES = 4;
export const NOT_FOUND =
  'Lyrics not found for this song. You can type them manually.';
export const OFFLINE_LYRICS =
  "You're offline, so lyrics can't be fetched. You can type them manually.";

export const cleanTitle = (t: string) =>
  t
    .replace(/\s*[\(\[].*?[\)\]]/g, '')
    .replace(/\s+-\s+.*$/, '')
    .trim();

export const stripFeat = (t: string) =>
  t
    .replace(
      /\s*[\(\[]\s*(?:feat|ft|featuring|with)\.?\s[^\)\]]*[\)\]]/gi,
      ''
    )
    .replace(/\s+(?:feat|ft|featuring)\.?\s.*$/i, '')
    .trim();

export function lyricQueries(artist: string, title: string): [string, string][] {
  const out: [string, string][] = [];
  const seen = new Set<string>();
  const add = (a: string, t: string) => {
    a = (a || '').trim();
    t = (t || '').trim();
    const k = (a + '|' + t).toLowerCase();
    if (a && t && !seen.has(k)) {
      seen.add(k);
      out.push([a, t]);
    }
  };
  const a1 = artist.trim();
  const a2 = stripFeat(a1);
  const a3 = a2.split(/\s*(?:,|&|;|\band\b)\s*/i)[0];
  const tc = cleanTitle(title);
  const tn = stripFeat(tc);
  add(a1, tc);
  add(a1, tn);
  add(a2, tn);
  add(a3, tn);
  add(a1, title);
  return out;
}

export function stripLrc(text: string): string {
  return String(text || '')
    .split(/\r?\n/)
    .filter((l) => !/^\s*\[[a-z]{1,}:[^\]]*\]\s*$/i.test(l))
    .map((l) =>
      l
        .replace(/\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/g, '')
        .replace(/<\d{1,3}:\d{2}(?:[.:]\d{1,3})?>/g, '')
        .trim()
    )
    .join('\n');
}

export function parseStanzas(raw: string): string[] {
  const lines = String(raw || '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^paroles de la chanson/i.test(l));

  const blocks: string[] = [];
  for (let i = 0; i < lines.length; i += LINES_PER_BLOCK) {
    blocks.push(lines.slice(i, i + LINES_PER_BLOCK).join('\n'));
  }
  return blocks;
}

export function bestLrclib(list: any[], duration: number) {
  const ok = (Array.isArray(list) ? list : []).filter(
    (r) =>
      r &&
      !r.instrumental &&
      ((r.plainLyrics && r.plainLyrics.trim()) ||
        (r.syncedLyrics && r.syncedLyrics.trim()))
  );
  if (!ok.length) return null;
  if (duration > 0) {
    ok.sort(
      (a, b) =>
        Math.abs((a.duration || 1e9) - duration) -
        Math.abs((b.duration || 1e9) - duration)
    );
  }
  return ok[0];
}

export const lrcText = (r: any) =>
  r && !r.instrumental
    ? r.plainLyrics && r.plainLyrics.trim()
      ? r.plainLyrics
      : r.syncedLyrics
      ? stripLrc(r.syncedLyrics)
      : ''
    : '';

export async function fetchLyrics(
  artist: string,
  title: string,
  duration = 0,
  stale: () => boolean = () => false
): Promise<{ blocks: string[]; source: string }> {
  const q = lyricQueries(artist, title);
  const asHit = (text: string, source: string) => {
    const blocks = parseStanzas(text);
    return blocks.length ? { blocks, source } : null;
  };
  let hit: { blocks: string[]; source: string } | null = null;

  // 1. lyrics.ovh
  try {
    const d = await fetchJson(
      `${LYRICS_API}/${encodeURIComponent(q[0][0])}/${encodeURIComponent(
        q[0][1]
      )}`,
      LYRICS_TIMEOUT
    );
    hit = asHit(d && d.lyrics, 'lyrics.ovh');
  } catch (_) {
    // fall through to LRCLIB
  }

  // 2. LRCLIB exact /get
  for (const [a, t] of q.slice(0, 4)) {
    if (hit || stale()) break;
    try {
      const qs =
        `track_name=${encodeURIComponent(t)}&artist_name=${encodeURIComponent(
          a
        )}` + (duration > 0 ? `&duration=${Math.round(duration)}` : '');
      hit = asHit(
        lrcText(await fetchJson(`${LRCLIB_API}/get?${qs}`, LYRICS_TIMEOUT)),
        'LRCLIB'
      );
    } catch (_) {
      // 404 = try next variant
    }
  }

  // 3. LRCLIB /search
  const best = q[Math.min(1, q.length - 1)];
  for (const qs of [
    `track_name=${encodeURIComponent(q[0][1])}&artist_name=${encodeURIComponent(
      q[0][0]
    )}`,
    `q=${encodeURIComponent(best[0] + ' ' + best[1])}`,
  ]) {
    if (hit || stale()) break;
    try {
      hit = asHit(
        lrcText(
          bestLrclib(
            await fetchJson(`${LRCLIB_API}/search?${qs}`, LYRICS_TIMEOUT),
            duration
          )
        ),
        'LRCLIB'
      );
    } catch (_) {
      // next
    }
  }

  if (!hit) {
    throw new SearchError(navigator.onLine === false ? OFFLINE_LYRICS : NOT_FOUND);
  }
  return hit;
}
