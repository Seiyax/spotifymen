import React, { useState, useEffect } from 'react';
import { MAX_LINES, fetchLyrics, parseStanzas } from '../../services/lyricsService';
import { contrastColor, hexToRgb } from '../../utils/colorUtils';
import { ChevronDown, Loader2 } from 'lucide-react';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: string;
  title: string;
  duration?: number;
  cardColor: string;
  onApplyLyrics: (lyrics: string) => void;
  onToast: (msg: string) => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  onClose,
  artist,
  title,
  duration = 0,
  cardColor,
  onApplyLyrics,
  onToast,
}) => {
  const [blocks, setBlocks] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);

  // Derive dynamic theme colors
  const { r, g, b } = hexToRgb(cardColor);
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = contrastColor(cardColor);
  const highlightTextColor = lum < 60 ? '#ffffff' : cardColor;

  // Fetch lyrics when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (!title.trim() || !artist.trim()) {
      setErrorMsg('Enter a song title and artist first, or pick one via Search.');
      setBlocks([]);
      setSelected([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);
    setSelected([]);
    setBlocks([]);
    setSource('');

    fetchLyrics(artist, title, duration, () => !isMounted)
      .then((res) => {
        if (!isMounted) return;
        setBlocks(res.blocks);
        setSource(res.source);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err.message || 'Could not find lyrics for this song.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, artist, title, duration]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleBlock = (index: number) => {
    if (selected.includes(index)) {
      setSelected((prev) => prev.filter((i) => i !== index));
    } else {
      if (selected.length >= MAX_LINES) {
        setShakingIdx(index);
        setTimeout(() => setShakingIdx(null), 400);
        onToast(`You can select up to ${MAX_LINES} lines`);
        return;
      }
      setSelected((prev) => [...prev, index]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    const sortedLines = [...selected]
      .sort((a, b) => a - b)
      .map((i) => blocks[i])
      .join('\n');
    onApplyLyrics(sortedLines);
    onClose();
    onToast('Lyrics applied to card');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Card / Bottom Sheet */}
      <div
        className="relative flex flex-col w-full sm:max-w-xl h-[85vh] sm:h-[82vh] max-h-[820px] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6"
        style={{
          backgroundColor: cardColor,
          color: textColor,
        }}
      >
        {/* Sticky Header */}
        <header
          className="flex items-center justify-between px-5 py-4 border-b border-black/10 shrink-0"
          style={{ backgroundColor: cardColor }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 active:scale-95 transition-all"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          <div className="text-center min-w-0 flex-1 px-2">
            <h2 className="text-base font-bold truncate">Select Lyrics</h2>
            <p className="text-xs opacity-75 truncate">
              {selected.length
                ? `${selected.length} of ${MAX_LINES} lines selected`
                : `Tap up to ${MAX_LINES} lines`}
            </p>
            {source && (
              <p className="text-[10px] opacity-60 font-mono mt-0.5">
                Source: {source}
              </p>
            )}
          </div>

          <div className="w-10 h-10 shrink-0" />
        </header>

        {/* Scrollable Lyric Stanzas */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-2 overscroll-contain scrollbar-none">
          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16 opacity-85">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Fetching lyrics…</p>
            </div>
          )}

          {errorMsg && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-2 opacity-80">
              <p className="text-sm font-semibold">{errorMsg}</p>
              <p className="text-xs opacity-75">
                You can manually type or paste lyrics directly into the editor text field.
              </p>
            </div>
          )}

          {!isLoading &&
            !errorMsg &&
            blocks.map((line, idx) => {
              const isSelected = selected.includes(idx);
              const isShaking = shakingIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleBlock(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl font-bold text-lg sm:text-2xl tracking-tight leading-tight transition-all active:scale-[0.99] ${
                    isShaking ? 'animate-bounce' : ''
                  } ${
                    isSelected
                      ? 'bg-black shadow-xl opacity-100 scale-[1.01]'
                      : 'opacity-40 hover:opacity-75 bg-transparent'
                  }`}
                  style={{
                    color: isSelected ? highlightTextColor : textColor,
                  }}
                >
                  {line}
                </button>
              );
            })}
        </div>

        {/* Sticky Footer */}
        <footer
          className="relative px-6 py-4 pb-8 sm:pb-4 border-t border-black/10 flex justify-center shrink-0"
          style={{ backgroundColor: cardColor }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full max-w-sm py-3.5 px-6 rounded-full font-bold text-sm bg-white text-black hover:scale-102 active:scale-98 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl"
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
};
