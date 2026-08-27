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
          fontFamily: 'MiSans, "MiSans Normal", "MiSans-Normal", "MiSans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          themeVariables: isDark
            ? {
                primaryColor: '#1E293B',
                primaryTextColor: '#F8FAFC',
                primaryBorderColor: '#475569',
                lineColor: '#94A3B8',
                secondaryColor: '#0F172A',
                tertiaryColor: '#0F172A',
                actorBkg: '#1E293B',
                actorBorder: '#475569',
                actorTextColor: '#F8FAFC',
              }
            : {
                primaryColor: '#F1F5F9',
                primaryTextColor: '#0F172A',
                primaryBorderColor: '#CBD5E1',
                lineColor: '#64748B',
                secondaryColor: '#F8FAFC',
                tertiaryColor: '#FFFFFF',
                actorBkg: '#FFFFFF',
                actorBorder: '#CBD5E1',
                actorTextColor: '#0F172A',
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
    <div className="my-8 rounded-sm border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#161618]/60 backdrop-blur-sm overflow-hidden transition-all">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100/60 dark:bg-[#1a1a1e]/60 border-b border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-500 font-mono">
        <div className="flex items-center space-x-2">
          <Network className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            MERMAID 结构图
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-sm hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
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
          <div className="flex flex-col items-center justify-center space-y-2 text-slate-400 py-6">
            <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-sky-600 rounded-full animate-spin" />
            <span className="text-xs font-mono">正在渲染拓扑图...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-xs font-mono text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 rounded-sm">
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
