import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CardState,
  HistorySnapshot,
  LayoutKey,
  ThemeKey,
} from '../types';
import { THEME_GLARE } from '../engine/constants';
import {
  decodeLookHash,
  loadSettings,
  saveSettings,
} from '../utils/storage';

const DEFAULT_STATE: CardState = {
  title: '',
  artist: '',
  lyrics: '',
  coverUrl: '',
  color: '#A7429A',
  theme: 'classic',
  layoutKey: 'square',
  coverShape: 'auto',
  lyricFont: 'auto',
  align: 'left',
  hlLine: -1,
  bgStyle: 'none',
  glareStyle: 'diagonal',
  glare: 100,
  glareAuto: true,
  cardDepth: 0,
  autoFit: true,
  lyricSize: 48,
  transparent: false,
  scale: 2,
  fmt: 'png',
  autoColor: true,
  hide: {
    cover: false,
    title: false,
    artist: false,
    logo: false,
    bar: true,
    code: true,
  },
  trackId: null,
  preset: null,
};

export function useCardState() {
  const [state, setStateInternal] = useState<CardState>(() => {
    const saved = loadSettings();
    return {
      ...DEFAULT_STATE,
      ...saved,
      hide: { ...DEFAULT_STATE.hide, ...(saved.hide || {}) },
    };
  });

  const [songMeta, setSongMeta] = useState<{
    title: string;
    artist: string;
    duration: number;
  } | null>(null);

  // Undo / Redo history stack
  const historyRef = useRef<HistorySnapshot[]>([
    {
      color: state.color,
      theme: state.theme,
      title: state.title,
      artist: state.artist,
      lyrics: state.lyrics,
      layoutKey: state.layoutKey,
    },
  ]);
  const historyIndexRef = useRef<number>(0);
  const isHistoryActionRef = useRef<boolean>(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateHistoryState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const pushHistory = useCallback((snapshot: HistorySnapshot) => {
    if (isHistoryActionRef.current) return;
    const history = historyRef.current;
    const curIndex = historyIndexRef.current;
    const cur = history[curIndex];
    if (
      cur &&
      cur.color === snapshot.color &&
      cur.theme === snapshot.theme &&
      cur.title === snapshot.title &&
      cur.artist === snapshot.artist &&
      cur.lyrics === snapshot.lyrics &&
      cur.layoutKey === snapshot.layoutKey
    ) {
      return;
    }
    historyRef.current = history.slice(0, curIndex + 1);
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 100) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    updateHistoryState();
  }, [updateHistoryState]);

  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const queueHistoryPush = useCallback(
    (newState: CardState) => {
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = setTimeout(() => {
        pushHistory({
          color: newState.color,
          theme: newState.theme,
          title: newState.title,
          artist: newState.artist,
          lyrics: newState.lyrics,
          layoutKey: newState.layoutKey,
        });
      }, 400);
    },
    [pushHistory]
  );

  const setState = useCallback(
    (updater: Partial<CardState> | ((prev: CardState) => CardState)) => {
      setStateInternal((prev) => {
        const next =
          typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        saveSettings(next);
        queueHistoryPush(next);
        return next;
      });
    },
    [queueHistoryPush]
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const s = historyRef.current[historyIndexRef.current];
    isHistoryActionRef.current = true;
    setStateInternal((prev) => ({
      ...prev,
      color: s.color,
      theme: s.theme,
      title: s.title,
      artist: s.artist,
      lyrics: s.lyrics,
      layoutKey: s.layoutKey,
    }));
    updateHistoryState();
    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 50);
  }, [updateHistoryState]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const s = historyRef.current[historyIndexRef.current];
    isHistoryActionRef.current = true;
    setStateInternal((prev) => ({
      ...prev,
      color: s.color,
      theme: s.theme,
      title: s.title,
      artist: s.artist,
      lyrics: s.lyrics,
      layoutKey: s.layoutKey,
    }));
    updateHistoryState();
    setTimeout(() => {
      isHistoryActionRef.current = false;
    }, 50);
  }, [updateHistoryState]);

  // Set theme helper: updates glare if glareAuto is active
  const setTheme = useCallback(
    (theme: ThemeKey) => {
      setState((prev) => ({
        ...prev,
        theme,
        glareStyle: prev.glareAuto
          ? ((THEME_GLARE[theme] as any) || 'diagonal')
          : prev.glareStyle,
      }));
    },
    [setState]
  );

  // Set layout key helper
  const setLayoutKey = useCallback(
    (layoutKey: LayoutKey) => {
      setState((prev) => ({
        ...prev,
        layoutKey,
        preset: null, // clear preset if layout changes
      }));
    },
    [setState]
  );

  // Load from hash on mount
  useEffect(() => {
    const hash = window.location.hash || '';
    const m = /^#look=([A-Za-z0-9_-]{1,6000})$/.exec(hash);
    if (!m) return;
    try {
      const o = decodeLookHash(m[1]);
      if (o && typeof o === 'object') {
        setState((prev) => ({
          ...prev,
          theme: o.t || prev.theme,
          color: o.c || prev.color,
          glareStyle: o.g === 'auto' ? (THEME_GLARE[o.t as ThemeKey] as any || 'diagonal') : (o.g || prev.glareStyle),
          glareAuto: o.g === 'auto',
          glare: typeof o.gi === 'number' ? o.gi : prev.glare,
          layoutKey: o.l || prev.layoutKey,
          coverShape: o.cs || prev.coverShape,
          lyricFont: o.lf || prev.lyricFont,
          bgStyle: o.bg || prev.bgStyle,
          cardDepth: typeof o.d === 'number' ? o.d : prev.cardDepth,
          align: o.a || prev.align,
          autoColor: typeof o.ac === 'boolean' ? o.ac : prev.autoColor,
          title: typeof o.ti === 'string' ? o.ti : prev.title,
          artist: typeof o.ar === 'string' ? o.ar : prev.artist,
          lyrics: typeof o.ly === 'string' ? o.ly : prev.lyrics,
          coverUrl: typeof o.cu === 'string' ? o.cu : prev.coverUrl,
        }));
      }
    } catch (e) {
      console.warn('Failed to parse look from hash', e);
    }
  }, [setState]);

  return {
    state,
    setState,
    setTheme,
    setLayoutKey,
    songMeta,
    setSongMeta,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
