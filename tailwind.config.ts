import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,md,html}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#F3F7FC',
          card: 'rgba(255, 255, 255, 0.76)',
          dark: '#0B101B',
          'dark-card': 'rgba(16, 24, 40, 0.52)',
          border: 'rgba(255, 255, 255, 0.65)',
          'dark-border': 'rgba(255, 255, 255, 0.08)',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F5FE',
          200: '#BAECFD',
          300: '#7DDCFC',
          400: '#22C5FF',
          500: '#00BFFF', // 核心高亮色 DeepSkyBlue
          600: '#009FD6',
          700: '#007FA8',
          800: '#006280',
          900: '#004A61',
          950: '#002B3A',
        },
        highlight: '#00BFFF',
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
      },
      boxShadow: {
        glass:
          '0 2px 4px rgba(15, 23, 42, 0.02), 0 8px 16px rgba(15, 23, 42, 0.025), 0 16px 32px rgba(15, 23, 42, 0.03), 0 24px 48px -4px rgba(15, 23, 42, 0.035), inset 0 1px 0 0 rgba(255, 255, 255, 0.68)',
        'glass-hover':
          '0 4px 8px rgba(15, 23, 42, 0.03), 0 12px 24px rgba(15, 23, 42, 0.04), 0 24px 48px rgba(0, 191, 255, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.75)',
        'glass-dark':
          '0 2px 6px rgba(0, 0, 0, 0.18), 0 8px 18px rgba(0, 0, 0, 0.22), 0 20px 38px -4px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-dark-hover':
          '0 4px 10px rgba(0, 0, 0, 0.22), 0 12px 28px rgba(0, 0, 0, 0.32), 0 28px 52px -4px rgba(0, 0, 0, 0.48), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'fluid-glass':
          '0 2px 4px rgba(15, 23, 42, 0.02), 0 8px 16px rgba(15, 23, 42, 0.025), 0 16px 32px rgba(15, 23, 42, 0.03), 0 32px 64px rgba(15, 23, 42, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.68), inset 0 -1px 0 0 rgba(0, 0, 0, 0.02)',
        'fluid-glass-hover':
          '0 4px 8px rgba(15, 23, 42, 0.03), 0 12px 24px rgba(15, 23, 42, 0.04), 0 24px 48px rgba(15, 23, 42, 0.05), 0 36px 72px -4px rgba(0, 191, 255, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.75), inset 0 -1px 0 0 rgba(0, 0, 0, 0.03)',
        'fluid-glass-dark':
          '0 2px 6px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.25), 0 20px 42px -4px rgba(0, 0, 0, 0.42), inset 0 1px 1px 0 rgba(255, 255, 255, 0.14), inset 0 -1px 0 0 rgba(0, 0, 0, 0.25)',
        'fluid-glass-dark-hover':
          '0 4px 10px rgba(0, 0, 0, 0.20), 0 14px 30px rgba(0, 0, 0, 0.32), 0 28px 56px -4px rgba(0, 0, 0, 0.52), inset 0 1px 1px 0 rgba(255, 255, 255, 0.20), inset 0 -1px 0 0 rgba(0, 0, 0, 0.32)',
        'smooth-ambient':
          '0 2px 4px rgba(15, 23, 42, 0.02), 0 8px 16px rgba(15, 23, 42, 0.03), 0 16px 32px rgba(15, 23, 42, 0.04), 0 32px 64px rgba(15, 23, 42, 0.05)',
        'smooth-ambient-dark':
          '0 2px 6px rgba(0, 0, 0, 0.20), 0 8px 18px rgba(0, 0, 0, 0.30), 0 20px 40px rgba(0, 0, 0, 0.45), 0 36px 72px rgba(0, 0, 0, 0.55)',
        'fluid-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.68), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.02)',
        'fluid-inset-dark': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.22)',
      },
      borderRadius: {
        none: '0',
        xs: '0.1875rem', // 3px
        sm: '0.25rem', // 4px (徽标、小按钮)
        DEFAULT: '0.3125rem', // 5px (黄金微倒角)
        md: '0.375rem', // 6px (容器、卡片微倒角)
        lg: '0.5rem', // 8px (模态框、下拉面板)
        xl: '0.75rem', // 12px (抽屉、主卡片)
        '2xl': '1rem', // 16px (移动端自适应抽屉)
        full: '9999px',
      },
      fontFamily: {
        humanist: [
          'Lora',
          '"LXGW WenKai"',
          '"霞鹜文楷"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          'Georgia',
          'serif',
        ],
        serif: [
          'Lora',
          '"LXGW WenKai"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          'Newsreader',
          'Georgia',
          '"Songti SC"',
          'serif',
        ],
        sans: [
          'MiSans',
          'MiSans Normal',
          'MiSans-Normal',
          'MiSans VF',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        xingshu: [
          '"hongleixingshu"',
          '"Source Han Serif SC"',
          '"Noto Serif SC"',
          'serif',
        ],
        youran: [
          '"slideyouran"',
          'MiSans',
          'cursive',
          'sans-serif',
        ],
        maple: [
          '"Maple Mono CN"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'monospace',
          'sans-serif',
        ],
        douyin: [
          '"Douyin Sans"',
          '"抖音美好体"',
          'sans-serif',
        ],
      },
      typography: () => ({
        paper: {
          css: {
            '--tw-prose-body': '#334155', // slate-700
            '--tw-prose-headings': '#0f172a', // slate-900
            '--tw-prose-lead': '#475569', // slate-600
            '--tw-prose-links': '#0284c7',
            '--tw-prose-bold': '#0f172a',
            '--tw-prose-counters': '#64748b', // slate-500
            '--tw-prose-bullets': '#94a3b8', // slate-400
            '--tw-prose-hr': '#e2e8f0', // slate-200
            '--tw-prose-quotes': '#334155',
            '--tw-prose-quote-borders': '#cbd5e1', // slate-300
            '--tw-prose-captions': '#64748b',
            '--tw-prose-code': '#0f172a',
            '--tw-prose-pre-code': '#f8fafc', // slate-50
            '--tw-prose-pre-bg': '#0f172a',
            '--tw-prose-th-borders': '#cbd5e1',
            '--tw-prose-td-borders': '#e2e8f0',
            '--tw-prose-invert-body': '#cbd5e1', // slate-300 柔和夜间阅读
            '--tw-prose-invert-headings': '#f1f5f9', // slate-100 杜绝纯白刺眼光晕
            '--tw-prose-invert-lead': '#94a3b8',
            '--tw-prose-invert-links': '#38bdf8',
            '--tw-prose-invert-bold': '#f1f5f9',
            '--tw-prose-invert-counters': '#94a3b8',
            '--tw-prose-invert-bullets': '#64748b',
            '--tw-prose-invert-hr': '#1e293b',
            '--tw-prose-invert-quotes': '#cbd5e1',
            '--tw-prose-invert-quote-borders': '#334155',
            '--tw-prose-invert-captions': '#94a3b8',
            '--tw-prose-invert-code': '#f1f5f9',
            '--tw-prose-invert-pre-code': '#cbd5e1',
            '--tw-prose-invert-pre-bg': '#111827',
            '--tw-prose-invert-th-borders': '#334155',
            '--tw-prose-invert-td-borders': '#334155',
            maxWidth: '65ch',
            lineHeight: '1.85',
            letterSpacing: '0.015em',
            fontSize: '1.03rem',
            blockquote: {
              fontFamily: 'Lora, "LXGW WenKai", "霞鹜文楷", "Noto Serif SC", serif',
              fontStyle: 'normal',
              fontWeight: '400',
              borderLeftWidth: '2px',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              paddingLeft: '1.25rem',
              letterSpacing: '0.01em',
            },
            h1: {
              fontFamily: 'MiSans, "MiSans Normal", "MiSans-Normal", "MiSans VF", sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: 'MiSans, "MiSans Normal", "MiSans-Normal", "MiSans VF", sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.015em',
            },
            h3: {
              fontFamily: 'MiSans, "MiSans Normal", "MiSans-Normal", "MiSans VF", sans-serif',
              fontWeight: '600',
            },
            code: {
              fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontWeight: '500',
              fontSize: '0.875em',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              backgroundColor: 'rgba(100, 116, 139, 0.12)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'pre code': {
              backgroundColor: 'transparent !important',
              padding: '0 !important',
              borderRadius: '0 !important',
              fontWeight: 'inherit !important',
              fontSize: 'inherit !important',
            },
            'pre code span': {
              backgroundColor: 'transparent !important',
              padding: '0 !important',
              borderRadius: '0 !important',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
