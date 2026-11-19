import { SearchResult } from '../types';

export class SearchError extends Error {
  http?: boolean;
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SearchError';
    if (status !== undefined) {
      this.http = true;
      this.status = status;
    }
  }
}

export const ITUNES_URL = 'https://itunes.apple.com/search';
export const SPOTIFY_OEMBED = 'https://open.spotify.com/oembed';
export const REQUEST_TIMEOUT = 8000;
export const SPOTIFY_TRACK_RE =
  /^https?:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]+)/i;

export const netMsg = (m: string) =>
  navigator.onLine === false
    ? "You're offline. Searching needs an internet connection, but you can still edit and export your card."
    : m;

export async function fetchJson<T = any>(
  url: string,
  timeout = REQUEST_TIMEOUT
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) {
      throw new SearchError(`HTTP ${res.status}`, res.status);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

let jsonpCounter = 0;
export function jsonp<T = any>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = '__itunesCb' + ++jsonpCounter;
    const script = document.createElement('script');
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timer);
      delete (window as any)[cb];
      script.remove();
    };

    (window as any)[cb] = (data: T) => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error('jsonp network error'));
    };
    timer = setTimeout(() => {
      cleanup();
      reject(new Error('jsonp timeout'));
    }, REQUEST_TIMEOUT);

    script.src = url + '&callback=' + cb;
    document.head.appendChild(script);
  });
}

export async function searchItunes(query: string): Promise<SearchResult[]> {
  const url = `${ITUNES_URL}?term=${encodeURIComponent(
    query
  )}&entity=song&limit=8`;

  let data: any;
  try {
    data = await fetchJson(url);
  } catch (err: any) {
    if (err instanceof SearchError && err.http) {
      throw new SearchError(
        `iTunes returned an error (${err.status}). Please try again in a moment.`
      );
    }
    try {
      data = await jsonp(url);
    } catch (_) {
      throw new SearchError(
        netMsg(
          "Couldn't reach iTunes. Check your internet connection and try again."
        )
      );
    }
  }

  const hits = (
    data && Array.isArray(data.results) ? data.results : []
  ).filter((h: any) => h.artworkUrl100);

  if (!hits.length) {
    throw new SearchError(
      `No results found for "${query}". Try different keywords.`
    );
  }

  return hits.map((h: any) => ({
    thumb: h.artworkUrl100,
    cover: h.artworkUrl100.replace('100x100', '600x600'),
    title: h.trackName || '',
    artist: h.artistName || '',
    album: h.collectionName || '',
    duration: h.trackTimeMillis ? Math.round(h.trackTimeMillis / 1000) : 0,
  }));
}

export async function fetchSpotifyCover(
  rawUrl: string
): Promise<{ coverUrl: string; trackId: string | null }> {
  const match = rawUrl.match(SPOTIFY_TRACK_RE);
  if (!match) {
    throw new SearchError(
      'That does not look like a Spotify track link. It should start with https://open.spotify.com/track/'
    );
  }

  const trackId = match[1];
  const canonical = `https://open.spotify.com/track/${trackId}`;

  let data: any;
  try {
    data = await fetchJson(
      `${SPOTIFY_OEMBED}?url=${encodeURIComponent(canonical)}`
    );
  } catch (err: any) {
    if (err instanceof SearchError && err.http) {
      throw new SearchError(
        err.status === 404
          ? 'Spotify could not find that track. Check the link and try again.'
          : `Spotify returned an error (${err.status}). Please try again in a moment.`
      );
    }
    throw new SearchError(
      netMsg(
        "Couldn't reach Spotify (network issue or blocked by CORS). Try the keyword search instead."
      )
    );
  }

  if (!data || !data.thumbnail_url) {
    throw new SearchError(
      'Spotify did not return a cover image for this track.'
    );
  }
  return { coverUrl: data.thumbnail_url, trackId };
}
