import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCardState } from './hooks/useCardState';
import { useTiltInteraction } from './hooks/useTiltInteraction';
import { Header } from './components/layout/Header';
import { TabNav, TabId } from './components/layout/TabNav';
import { Stage } from './components/layout/Stage';
import { SearchSection } from './components/editor/SearchSection';
import { TextSection } from './components/editor/TextSection';
import { StyleSection } from './components/editor/StyleSection';
import { LayoutSection } from './components/editor/LayoutSection';
import { LooksSection } from './components/editor/LooksSection';
import { LyricsModal } from './components/modals/LyricsModal';
import { ExportModal } from './components/modals/ExportModal';
import { KeyboardHelpModal } from './components/modals/KeyboardHelpModal';
import { Toast } from './components/ui/Toast';
import { extractCoverColors } from './utils/colorUtils';
import { THEMES } from './engine/constants';
import { LayoutKey, SearchResult, ThemeKey } from './types';
import { Download } from 'lucide-react';

export default function App() {
  const {
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
  } = useCardState();

  const {
    tilt,
    resetTilt,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = useTiltInteraction();

  const [activeTab, setActiveTab] = useState<TabId>('search');
  const [coverImg, setCoverImg] = useState<HTMLImageElement | null>(null);
  const [coverPalette, setCoverPalette] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [renderedLyricSize, setRenderedLyricSize] = useState<number>(state.lyricSize);
  const [hasTextOverflow, setHasTextOverflow] = useState<boolean>(false);

  // Modals
  const [lyricsModalOpen, setLyricsModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string, isError = false) => {
    setToastMessage(msg);
    setToastIsError(isError);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Load Cover Image
  useEffect(() => {
    if (!state.coverUrl) {
      setCoverImg(null);
      setCoverPalette([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      setCoverImg(img);
      try {
        const pal = extractCoverColors(img);
        setCoverPalette(pal);
        if (state.autoColor && pal.length > 0) {
          setState({ color: pal[0] });
        }
      } catch (e) {
        setCoverPalette([]);
      }
    };

    img.onerror = () => {
      setCoverImg(null);
      setCoverPalette([]);
      showToast('Could not load cover art. Host may restrict cross-origin access.', true);
    };

    img.src = state.coverUrl;
  }, [state.coverUrl, state.autoColor, setState, showToast]);

  const handleMatchCoverColor = useCallback(() => {
    if (coverPalette.length > 0) {
      setState({ color: coverPalette[0], autoColor: false });
      showToast(`Matched cover color: ${coverPalette[0]}`);
    } else {
      showToast('No album cover loaded yet.', true);
    }
  }, [coverPalette, setState, showToast]);

  const handleSelectSong = useCallback(
    (song: SearchResult) => {
      setState({
        title: song.title,
        artist: song.artist,
        coverUrl: song.cover,
        trackId: null,
      });
      setSongMeta({
        title: song.title,
        artist: song.artist,
        duration: song.duration,
      });
      setActiveTab('text');
      setLyricsModalOpen(true);
    },
    [setState, setSongMeta]
  );

  const handleSpotifyTrack = useCallback(
    (coverUrl: string, trackId: string | null) => {
      setState({
        coverUrl,
        trackId,
      });
    },
    [setState]
  );

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT' ||
        activeEl?.hasAttribute('contenteditable');

      if (isInput) return;
      if (lyricsModalOpen || exportModalOpen || keyboardHelpOpen) return;

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
          return;
        } else if (key === 'y') {
          e.preventDefault();
          redo();
          return;
        }
      }

      if (e.key === '?') {
        e.preventDefault();
        setKeyboardHelpOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setExportModalOpen(true);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const layouts: LayoutKey[] = ['square', 'wide', 'story', 'portrait', 'tall'];
        setLayoutKey(layouts[parseInt(e.key, 10) - 1]);
        showToast(`Layout: ${layouts[parseInt(e.key, 10) - 1]}`);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const themes = Object.keys(THEMES) as ThemeKey[];
        const curIdx = themes.indexOf(state.theme);
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const nextTheme = themes[(curIdx + dir + themes.length) % themes.length];
        setTheme(nextTheme);
        showToast(`Theme: ${THEMES[nextTheme].label}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    lyricsModalOpen,
    exportModalOpen,
    keyboardHelpOpen,
    redo,
    undo,
    setLayoutKey,
    setTheme,
    state.theme,
    showToast,
  ]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-[#121212] text-white overflow-hidden font-sans">
      {/* Header on top */}
      <div className="flex flex-col lg:hidden shrink-0">
        <Header
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onOpenHelp={() => setKeyboardHelpOpen(true)}
          onToast={showToast}
        />
      </div>

      {/* Mobile Stage (top preview on small screens) */}
      <div className="flex lg:hidden flex-col shrink-0 max-h-[42vh] min-h-[260px] border-b border-[#262626]">
        <Stage
          state={state}
          coverImg={coverImg}
          tilt={tilt}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onResetTilt={resetTilt}
          isPinned={isPinned}
          onTogglePin={() => setIsPinned((prev) => !prev)}
          onCodeLoad={() => setState((prev) => ({ ...prev }))}
          onCardRenderedSize={(size, overflow) => {
            setRenderedLyricSize(size);
            setHasTextOverflow(overflow);
          }}
        />
      </div>

      {/* Control Panel: Full sidebar on desktop, scrollable editor on mobile */}
      <aside className="w-full lg:w-[420px] xl:w-[460px] flex flex-col flex-1 lg:h-full bg-[#181818]/95 backdrop-blur-2xl lg:border-r border-[#262626] shrink-0 z-10 shadow-2xl min-h-0">
        <div className="hidden lg:block shrink-0">
          <Header
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onOpenHelp={() => setKeyboardHelpOpen(true)}
            onToast={showToast}
          />
        </div>

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#363636] overscroll-contain">
          {activeTab === 'search' && (
            <SearchSection
              onSelectSong={handleSelectSong}
              onSpotifyTrack={handleSpotifyTrack}
              onToast={showToast}
            />
          )}

          {activeTab === 'text' && (
            <TextSection
              state={state}
              onChange={setState}
              onOpenLyricsModal={() => setLyricsModalOpen(true)}
            />
          )}

          {activeTab === 'style' && (
            <StyleSection
              state={state}
              onChange={setState}
              onSetTheme={setTheme}
              onSetLayout={setLayoutKey}
              coverPalette={coverPalette}
              onMatchCoverColor={handleMatchCoverColor}
              renderedLyricSize={renderedLyricSize}
              hasTextOverflow={hasTextOverflow}
            />
          )}

          {activeTab === 'layout' && (
            <LayoutSection
              state={state}
              onChange={setState}
              onToast={showToast}
            />
          )}

          {activeTab === 'looks' && (
            <LooksSection
              state={state}
              onApplyLook={(look) => {
                setState((prev) => ({
                  ...prev,
                  theme: (look.t as ThemeKey) || prev.theme,
                  color: look.c || prev.color,
                  glareStyle: (look.g as any) || prev.glareStyle,
                  glare: typeof look.gi === 'number' ? look.gi : prev.glare,
                  layoutKey: (look.l as LayoutKey) || prev.layoutKey,
                  coverShape: (look.cs as any) || prev.coverShape,
                  lyricFont: (look.lf as any) || prev.lyricFont,
                  bgStyle: look.bg || prev.bgStyle,
                  cardDepth: typeof look.d === 'number' ? look.d : prev.cardDepth,
                  align: look.a || prev.align,
                  autoColor: typeof look.ac === 'boolean' ? look.ac : prev.autoColor,
                }));
              }}
              onToast={showToast}
            />
          )}
        </div>

        {/* Sticky Export Button Footer */}
        <footer className="p-3.5 sm:p-4 border-t border-[#262626] bg-[#141414]/90 backdrop-blur-xl shrink-0">
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="w-full py-3 sm:py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm bg-[#1db954] hover:bg-[#1ed760] text-black flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(29,185,84,0.3)] hover:shadow-[0_12px_30px_rgba(29,185,84,0.45)] hover:scale-[1.01] active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export & Download Card</span>
          </button>
        </footer>
      </aside>

      {/* Desktop Stage (right side on large screens) */}
      <div className="hidden lg:flex flex-1 h-full">
        <Stage
          state={state}
          coverImg={coverImg}
          tilt={tilt}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onResetTilt={resetTilt}
          isPinned={false}
          onTogglePin={() => {}}
          onCodeLoad={() => setState((prev) => ({ ...prev }))}
          onCardRenderedSize={(size, overflow) => {
            setRenderedLyricSize(size);
            setHasTextOverflow(overflow);
          }}
        />
      </div>

      {/* Modals */}
      <LyricsModal
        isOpen={lyricsModalOpen}
        onClose={() => setLyricsModalOpen(false)}
        artist={state.artist}
        title={state.title}
        duration={songMeta?.duration}
        cardColor={state.color}
        onApplyLyrics={(lyrics) => setState({ lyrics })}
        onToast={showToast}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        state={state}
        coverImg={coverImg}
        onUpdateState={setState}
        onToast={showToast}
      />

      <KeyboardHelpModal
        isOpen={keyboardHelpOpen}
        onClose={() => setKeyboardHelpOpen(false)}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} isError={toastIsError} />
    </div>
  );
}
