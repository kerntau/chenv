import React, { useEffect, useRef, useState, useId } from 'react';
import { Music, Check, Copy } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AbcjsBlockProps {
  abcNotation: string;
}

export const AbcjsBlock: React.FC<AbcjsBlockProps> = ({ abcNotation }) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const uniqueId = useId().replace(/[:]/g, '_');
  const targetElementId = `abcjs_render_${uniqueId}`;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    import('abcjs')
      .then((abcModule) => {
        if (!active) return;
        const abcjs = abcModule.default || abcModule;
        const target = document.getElementById(targetElementId);
        if (target) {
          target.innerHTML = '';
          abcjs.renderAbc(targetElementId, abcNotation.trim(), {
            responsive: 'resize',
            add_classes: true,
            foregroundColor: isDark ? '#E4E4E7' : '#292524',
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error('ABCJS render error:', err);
          setError('乐谱渲染失败，请检查 ABC 记谱语法');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [abcNotation, isDark, targetElementId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(abcNotation.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#18181B]/80 backdrop-blur-sm overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-100/70 dark:bg-[#202024]/70 border-b border-stone-200/60 dark:border-stone-800/80 text-xs text-stone-500 font-mono">
        <div className="flex items-center space-x-2">
          <Music className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span className="font-medium text-stone-700 dark:text-stone-300">
            ABC NOTATION 乐谱渲染
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          title="复制乐谱文本"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>记谱</span>
            </>
          )}
        </button>
      </div>

      {/* 乐谱画布 */}
      <div className="p-6 flex flex-col items-center justify-center overflow-x-auto min-h-[160px]">
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 text-stone-400 py-6">
            <div className="w-5 h-5 border-2 border-stone-300 dark:border-stone-600 border-t-amber-600 rounded-full animate-spin" />
            <span className="text-xs font-mono">正在生成五线谱...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg">
            {error}
          </div>
        )}

        <div
          id={targetElementId}
          ref={containerRef}
          className="abcjs-container w-full max-w-full flex justify-center overflow-x-auto"
        />
      </div>
    </div>
  );
};
