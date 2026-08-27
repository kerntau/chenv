import React, { useMemo } from 'react';
import katex from 'katex';
import { CodeBlock } from './CodeBlock';
import { MermaidBlock } from './MermaidBlock';
import { AbcjsBlock } from './AbcjsBlock';
import { Callout } from './Callout';

interface MarkdownRendererProps {
  content: string;
}

type BlockToken =
  | { type: 'code'; lang: string; code: string }
  | { type: 'mermaid'; chart: string }
  | { type: 'abc'; notation: string }
  | { type: 'math'; expression: string; displayMode: boolean }
  | { type: 'callout'; calloutType: 'note' | 'tip' | 'warning' | 'quote'; title?: string; text: string }
  | { type: 'markdown'; content: string };

function renderKatexMath(math: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(math.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch (err) {
    console.error('KaTeX render error:', err);
    return math;
  }
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const blocks = useMemo(() => {
    const lines = content.split('\n');
    const result: BlockToken[] = [];
    let currentMd: string[] = [];

    const flushMd = () => {
      if (currentMd.length > 0) {
        result.push({
          type: 'markdown',
          content: currentMd.join('\n'),
        });
        currentMd = [];
      }
    };

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 检测数学公式块 $$ ... $$
      if (trimmed.startsWith('$$')) {
        flushMd();
        const mathLines: string[] = [];
        const singleLineMatch = trimmed.match(/^\$\$(.+)\$\$$/);
        if (singleLineMatch) {
          result.push({
            type: 'math',
            expression: singleLineMatch[1],
            displayMode: true,
          });
          i++;
          continue;
        } else {
          i++;
          while (i < lines.length && !lines[i].trim().endsWith('$$')) {
            mathLines.push(lines[i]);
            i++;
          }
          if (i < lines.length) {
            const lastLine = lines[i].replace(/\$\$$/, '');
            if (lastLine) mathLines.push(lastLine);
            i++;
          }
          result.push({
            type: 'math',
            expression: mathLines.join('\n'),
            displayMode: true,
          });
          continue;
        }
      }

      // 检测代码块 ```
      if (trimmed.startsWith('```')) {
        flushMd();
        const lang = trimmed.slice(3).trim().toLowerCase();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // 跳过闭合 ```
        const code = codeLines.join('\n');

        if (lang === 'mermaid') {
          result.push({ type: 'mermaid', chart: code });
        } else if (lang === 'abc') {
          result.push({ type: 'abc', notation: code });
        } else {
          result.push({ type: 'code', lang: lang || 'text', code });
        }
        continue;
      }

      // 检测引用 Callout
      if (trimmed.startsWith('>')) {
        flushMd();
        const quoteLines: string[] = [];
        let calloutType: 'note' | 'tip' | 'warning' | 'quote' = 'note';
        let title: string | undefined;

        while (i < lines.length && lines[i].trim().startsWith('>')) {
          const raw = lines[i].replace(/^>\s?/, '');
          quoteLines.push(raw);
          i++;
        }

        const rawText = quoteLines.join('\n');
        if (rawText.includes('提示：') || rawText.includes('Tip:')) {
          calloutType = 'tip';
        } else if (rawText.includes('注意：') || rawText.includes('Warning:')) {
          calloutType = 'warning';
        } else if (rawText.includes('引用：') || rawText.includes('Quote:')) {
          calloutType = 'quote';
        }

        result.push({
          type: 'callout',
          calloutType,
          title,
          text: rawText,
        });
        continue;
      }

      currentMd.push(line);
      i++;
    }

    flushMd();
    return result;
  }, [content]);

  // 处理标准 Markdown 段落行内样式与标题锚点
  const renderMarkdownSegment = (md: string, keyPrefix: string) => {
    const rawLines = md.split('\n');
    const elements: React.ReactNode[] = [];

    let inList = false;
    let listItems: string[] = [];

    const flushList = (listKey: string) => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={listKey} className="my-4 pl-6 space-y-1.5 list-disc text-slate-700 dark:text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    rawLines.forEach((rawLine, idx) => {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(`list-${keyPrefix}-${idx}`);
        return;
      }

      // 标题
      const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        flushList(`list-${keyPrefix}-${idx}`);
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const cleanText = text.replace(/[*_`]/g, '');
        const id = cleanText
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '');

        if (level === 1) {
          elements.push(
            <h1
              id={id}
              key={`h1-${keyPrefix}-${idx}`}
              className="scroll-mt-24 font-serif text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-10 mb-4 tracking-tight"
            >
              {renderInlineMarkdown(text)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2
              id={id}
              key={`h2-${keyPrefix}-${idx}`}
              className="scroll-mt-24 font-serif text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-8 mb-3 tracking-tight border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5"
            >
              {renderInlineMarkdown(text)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3
              id={id}
              key={`h3-${keyPrefix}-${idx}`}
              className="scroll-mt-24 font-serif text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 mt-6 mb-2"
            >
              {renderInlineMarkdown(text)}
            </h3>
          );
        } else {
          elements.push(
            <h4
              id={id}
              key={`h4-${keyPrefix}-${idx}`}
              className="scroll-mt-24 font-serif text-base font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2"
            >
              {renderInlineMarkdown(text)}
            </h4>
          );
        }
        return;
      }

      // 列表
      const listMatch = line.match(/^[-*+]\s+(.+)$/);
      if (listMatch) {
        inList = true;
        listItems.push(listMatch[1]);
        return;
      }

      // 有序列表
      const numListMatch = line.match(/^\d+\.\s+(.+)$/);
      if (numListMatch) {
        flushList(`list-${keyPrefix}-${idx}`);
        elements.push(
          <div key={`num-${keyPrefix}-${idx}`} className="my-2 flex items-start space-x-2 text-slate-700 dark:text-slate-300">
            <span className="font-mono text-xs font-semibold text-slate-500 mt-1 min-w-[1.25rem]">
              {line.match(/^\d+\./)?.[0]}
            </span>
            <div className="flex-1 leading-relaxed">
              {renderInlineMarkdown(numListMatch[1])}
            </div>
          </div>
        );
        return;
      }

      flushList(`list-${keyPrefix}-${idx}`);

      // 普通段落
      elements.push(
        <p
          key={`p-${keyPrefix}-${idx}`}
          className="my-3.5 leading-relaxed text-slate-700 dark:text-slate-300 text-[1.02rem] tracking-wide"
        >
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    flushList(`list-${keyPrefix}-end`);
    return elements;
  };

  // 行内样式解析（支持行内 KaTeX $...$、加粗 **...**、行内代码 `...`、链接 [..](..)）
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // 替换行内公式 $...$ 为特殊标记并解析
    const parts = text.split(/(\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // 行内数学公式 $...$
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const mathExpr = part.slice(1, -1);
        const rendered = renderKatexMath(mathExpr, false);
        return (
          <span
            key={index}
            className="inline-katex mx-0.5"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        );
      }

      // 行内代码 `...`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-200/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // 加粗 **...**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-slate-900 dark:text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // 链接 [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target={linkMatch[2].startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            className="text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-slate-300 dark:decoration-slate-600 hover:decoration-slate-800 dark:hover:decoration-slate-200 transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }

      return part;
    });
  };

  return (
    <article className="prose prose-paper max-w-none text-slate-800 dark:text-slate-200">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'code':
            return (
              <CodeBlock
                key={`code-${idx}`}
                code={block.code}
                lang={block.lang}
              />
            );
          case 'mermaid':
            return <MermaidBlock key={`mermaid-${idx}`} chart={block.chart} />;
          case 'abc':
            return (
              <AbcjsBlock key={`abc-${idx}`} abcNotation={block.notation} />
            );
          case 'math': {
            const html = renderKatexMath(block.expression, block.displayMode);
            return (
              <div
                key={`math-${idx}`}
                className="my-6 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-900/30 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          case 'callout':
            return (
              <Callout
                key={`callout-${idx}`}
                type={block.calloutType}
                title={block.title}
              >
                {renderInlineMarkdown(block.text)}
              </Callout>
            );
          case 'markdown':
          default:
            return (
              <React.Fragment key={`md-${idx}`}>
                {renderMarkdownSegment(block.content, `seg-${idx}`)}
              </React.Fragment>
            );
        }
      })}
    </article>
  );
};
