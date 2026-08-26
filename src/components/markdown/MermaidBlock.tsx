import React, { useEffect, useRef, useState, useId } from 'react';
import { Network, Check, Copy } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface MermaidBlockProps {
  chart: string;
}

export const MermaidBlock: React.FC<MermaidBlockProps> = ({ chart }) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const uniqueId = useId().replace(/[:]/g, '_');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    import('mermaid')
      .then((m) => {
        if (!active) return;
        const mermaid = m.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Noto Serif SC, Source Han Serif SC, Georgia, serif',
          themeVariables: isDark
            ? {
                primaryColor: '#27272A',
                primaryTextColor: '#F4F4F5',
                primaryBorderColor: '#52525B',
                lineColor: '#A1A1AA',
                secondaryColor: '#18181B',
                tertiaryColor: '#18181B',
                actorBkg: '#27272A',
                actorBorder: '#52525B',
                actorTextColor: '#F4F4F5',
              }
            : {
                primaryColor: '#F5F5F4',
                primaryTextColor: '#292524',
                primaryBorderColor: '#D6D3D1',
                lineColor: '#78716C',
                secondaryColor: '#FAF8F5',
                tertiaryColor: '#FFFFFF',
                actorBkg: '#FFFFFF',
                actorBorder: '#D6D3D1',
                actorTextColor: '#292524',
              },
        });

        const id = `mermaid_${uniqueId}_${Date.now()}`;
        return mermaid.render(id, chart.trim());
      })
      .then((result) => {
        if (active && result) {
          setSvgContent(result.svg);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Mermaid render error:', err);
          setError('流程图解析失败，请检查语法规范');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [chart, isDark, uniqueId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/60 dark:bg-[#161618]/60 backdrop-blur-sm overflow-hidden transition-all">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-100/60 dark:bg-[#1a1a1e]/60 border-b border-stone-200/60 dark:border-stone-800/80 text-xs text-stone-500 font-mono">
        <div className="flex items-center space-x-2">
          <Network className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span className="font-medium text-stone-700 dark:text-stone-300">
            MERMAID 结构图
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          title="复制图表源码"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>源码</span>
            </>
          )}
        </button>
      </div>

      {/* 图表展示区 */}
      <div className="p-6 flex items-center justify-center overflow-x-auto min-h-[140px]">
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 text-stone-400 py-6">
            <div className="w-5 h-5 border-2 border-stone-300 dark:border-stone-600 border-t-amber-600 rounded-full animate-spin" />
            <span className="text-xs font-mono">正在渲染拓扑图...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && svgContent && (
          <div
            ref={containerRef}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto transition-all"
          />
        )}
      </div>
    </div>
  );
};
