import React, { useState } from 'react';
import { CardState, ExportFormat, LayoutKey, TiltState } from '../../types';
import {
  EXPORT_PRESETS,
  FORMATS,
  LAYOUTS,
  presetById,
} from '../../engine/constants';
import {
  dimsFor,
  encodeCanvas,
  fileBaseName,
  makeZip,
  renderCard3D,
  renderFlatCanvas,
  saveBlob,
  supportsWebp,
  takePreviewShot,
} from '../../engine/exportEngine';
import {
  Download,
  Box,
  Copy,
  Share2,
  Archive,
  X,
  Loader2,
  Check,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CardState;
  coverImg: HTMLImageElement | null;
  tilt: TiltState | null;
  onUpdateState: (updates: Partial<CardState>) => void;
  onToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  state,
  coverImg,
  tilt,
  onUpdateState,
  onToast,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPreset = presetById(state.preset);
  const currentFormat = FORMATS[state.fmt] || FORMATS.png;
  const currentLayout = LAYOUTS[state.layoutKey];

  // Presets
  const handleSelectPreset = (id: string) => {
    const p = presetById(id);
    if (!p) return;
    onUpdateState({
      preset: p.id,
      layoutKey: p.layout,
    });
    onToast(`Preset: ${p.label} (${p.w} × ${p.h})`);
  };

  const handleSelectScale = (scale: number) => {
    onUpdateState({ scale, preset: null });
    onToast(
      `Export scale: ${currentLayout.w * scale} × ${currentLayout.h * scale}`
    );
  };

  // 1. Download Flat
  const handleDownloadFlat = async () => {
    setIsExporting(true);
    setStatusMsg('Rendering flat card…');
    try {
      const dims = dimsFor(state.layoutKey, state);
      const out = renderFlatCanvas(state.layoutKey, dims, state.fmt, state, coverImg);
      const { blob, fmt, fellBack } = await encodeCanvas(out, state.fmt);
      const filename = fileBaseName(
        state.title,
        state.artist,
        `_${state.layoutKey}`,
        FORMATS[fmt].ext
      );
      saveBlob(blob, filename);
      onToast(
        fellBack
          ? `${FORMATS[state.fmt].label} fallback to PNG`
          : `Downloaded ${FORMATS[fmt].label} (${dims.w} × ${dims.h})`
      );
      onClose();
    } catch (e) {
      console.error(e);
      onToast('Export failed. The cover image may block cross-origin use.');
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  };

  // 2. Download 3D
  const handleDownload3D = async () => {
    setIsExporting(true);
    setStatusMsg('Saving the card at this angle…');
    try {
      await new Promise((r) => setTimeout(r, 40));
      const shot = takePreviewShot();
      const out = shot ?? renderCard3D(state, coverImg, 560, tilt);
      const { blob } = await encodeCanvas(out, 'png');
      const filename = fileBaseName(state.title, state.artist, '_3d', 'png');
      saveBlob(blob, filename);
      onToast('Downloaded the card at the current tilt');
      onClose();
    } catch (e) {
      console.error(e);
      onToast('3D Export failed. Check image CORS.');
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  };

  // 3. Copy to Clipboard
  const handleCopyClipboard = async () => {
    if (
      !navigator.clipboard ||
      typeof (window as any).ClipboardItem === 'undefined' ||
      !navigator.clipboard.write
    ) {
      onToast('Clipboard copy is not supported in this browser. Use Download instead.');
      return;
    }

    setIsExporting(true);
    setStatusMsg('Copying image to clipboard…');
    try {
      const dims = dimsFor(state.layoutKey, state);
      const out = renderFlatCanvas(state.layoutKey, dims, 'png', state, coverImg);
      const blobPromise = new Promise<Blob>((resolve, reject) => {
        out.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
      });
      await navigator.clipboard.write([
        new (window as any).ClipboardItem({ 'image/png': blobPromise }),
      ]);
      onToast('Copied card to clipboard!');
      onClose();
    } catch (e) {
      console.error(e);
      onToast('Copy failed. Browser may block clipboard image writes.');
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  };

  // 4. Native Share
  const handleNativeShare = async () => {
    if (!navigator.share) {
      onToast('Sharing files is not supported on this device.');
      return;
    }

    setIsExporting(true);
    setStatusMsg('Preparing share sheet…');
    try {
      const dims = dimsFor(state.layoutKey, state);
      const out = renderFlatCanvas(state.layoutKey, dims, state.fmt, state, coverImg);
      const { blob, fmt } = await encodeCanvas(out, state.fmt);
      const name = fileBaseName(state.title, state.artist, `_${state.layoutKey}`, FORMATS[fmt].ext);
      const file = new File([blob], name, { type: blob.type || FORMATS[fmt].mime });

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        saveBlob(blob, name);
        onToast('File sharing unsupported. Saved to downloads.');
        onClose();
        return;
      }

      await navigator.share({
        files: [file],
        title: [state.title, state.artist].filter(Boolean).join(' – ') || 'Lyric Card',
      });
      onToast('Shared successfully!');
      onClose();
    } catch (e: any) {
      if (e && e.name !== 'AbortError') {
        onToast('Share sheet closed.');
      }
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  };

  // 5. Download All Layouts Zip
  const handleDownloadZip = async () => {
    setIsExporting(true);
    const keys: LayoutKey[] = ['square', 'wide', 'story', 'portrait', 'tall'];
    const files: { name: string; data: Uint8Array }[] = [];

    try {
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        setStatusMsg(`Rendering ${i + 1} of ${keys.length}: ${LAYOUTS[k].label.split(' · ')[0]}…`);
        await new Promise((r) => setTimeout(r, 30));

        const dims = dimsFor(k, state, true);
        const out = renderFlatCanvas(k, dims, state.fmt, state, coverImg);
        const res = await encodeCanvas(out, state.fmt);
        const arrayBuf = await res.blob.arrayBuffer();
        const fname = fileBaseName(state.title, state.artist, `_${k}`, FORMATS[res.fmt].ext);
        files.push({ name: fname, data: new Uint8Array(arrayBuf) });
      }

      setStatusMsg('Compressing ZIP archive…');
      const zipBlob = makeZip(files);
      saveBlob(zipBlob, fileBaseName(state.title, state.artist, '_all-layouts', 'zip'));
      onToast(`Zip downloaded (${files.length} layout cards)`);
      onClose();
    } catch (e) {
      console.error(e);
      onToast('Zip creation failed.');
    } finally {
      setIsExporting(false);
      setStatusMsg(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Sheet */}
      <div className="relative flex flex-col w-full sm:max-w-md max-h-[90vh] bg-[#1a1a1a] border border-[#2f2f2f] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-bottom-6">
        <header className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-base font-bold text-white">Export & Download</h2>
            <p className="text-xs text-[#909090]">
              Save high-resolution flat cards, 3D cards, or batch bundles.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 1. Social Presets */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-[#1db954]">
            Size Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_PRESETS.map((p) => {
              const isSelected = state.preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#1db954]/20 border-[#1db954] text-white shadow-sm'
                      : 'bg-[#222222] border-[#333333] hover:border-[#444444] text-[#d0d0d0]'
                  }`}
                >
                  <span className="text-xs font-semibold">{p.label}</span>
                  <span className="text-[10.5px] text-[#808080]">
                    {p.w} × {p.h}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Image Resolution Scale (1x / 2x) */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#b3b3b3]">
            Image Scale
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#222222] border border-[#333333] rounded-xl">
            <button
              type="button"
              onClick={() => handleSelectScale(1)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                state.scale === 1 && !state.preset
                  ? 'bg-[#1db954] text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              1x ({currentLayout.w} × {currentLayout.h})
            </button>
            <button
              type="button"
              onClick={() => handleSelectScale(2)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                state.scale === 2 && !state.preset
                  ? 'bg-[#1db954] text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              2x ({currentLayout.w * 2} × {currentLayout.h * 2})
            </button>
          </div>
        </div>

        {/* 3. Format Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#b3b3b3]">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#222222] border border-[#333333] rounded-xl">
            {(['png', 'jpg', 'webp'] as ExportFormat[]).map((fmt) => {
              const isSelected = state.fmt === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onUpdateState({ fmt })}
                  className={`py-2 text-xs font-semibold uppercase rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#1db954] text-black shadow-sm'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {fmt} {fmt !== 'jpg' ? '· alpha' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-[#2a2a2a]">
          {/* Flat Export */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownload3D}
            className="w-full py-3 px-4 bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
          >
            <Box className="w-4 h-4" />
            <span>Download card</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadFlat}
            className="w-full py-3 px-4 bg-[#262626] hover:bg-[#303030] disabled:opacity-50 text-white font-semibold text-xs border border-[#383838] rounded-full flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Download className="w-4 h-4 text-[#1db954]" />
            <span>Download flat ({currentFormat.label})</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleCopyClipboard}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy to Clipboard</span>
          </button>

          {/* Share */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Image</span>
          </button>

          {/* Batch Zip */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadZip}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <Archive className="w-3.5 h-3.5 text-[#1db954]" />
            <span>Download All 5 Layouts (.zip)</span>
          </button>
        </div>

        {/* Status indicator */}
        {statusMsg && (
          <div className="flex items-center justify-center gap-2 text-xs text-[#1db954] animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
