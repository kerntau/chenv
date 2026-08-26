import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,md,html}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FAF8F5',
          card: '#FFFFFF',
          dark: '#18181B',
          'dark-card': '#202024',
          border: 'rgba(231, 229, 228, 0.75)',
          'dark-border': 'rgba(63, 63, 70, 0.6)',
        },
      },
      fontFamily: {
        serif: [
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          'SimSun',
          'Georgia',
          'serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"SFMono-Regular"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      typography: () => ({
        paper: {
          css: {
            '--tw-prose-body': '#292524',
            '--tw-prose-headings': '#1c1917',
            '--tw-prose-lead': '#57534e',
            '--tw-prose-links': '#1c1917',
            '--tw-prose-bold': '#1c1917',
            '--tw-prose-counters': '#78716c',
            '--tw-prose-bullets': '#a8a29e',
            '--tw-prose-hr': '#e7e5e4',
            '--tw-prose-quotes': '#44403c',
            '--tw-prose-quote-borders': '#d6d3d1',
            '--tw-prose-captions': '#78716c',
            '--tw-prose-code': '#1c1917',
            '--tw-prose-pre-code': '#f5f5f4',
            '--tw-prose-pre-bg': '#1c1917',
            '--tw-prose-th-borders': '#d6d3d1',
            '--tw-prose-td-borders': '#e7e5e4',
            '--tw-prose-invert-body': '#d6d3d1',
            '--tw-prose-invert-headings': '#fafaf9',
            '--tw-prose-invert-lead': '#a8a29e',
            '--tw-prose-invert-links': '#fafaf9',
            '--tw-prose-invert-bold': '#fafaf9',
            '--tw-prose-invert-counters': '#a8a29e',
            '--tw-prose-invert-bullets': '#57534e',
            '--tw-prose-invert-hr': '#292524',
            '--tw-prose-invert-quotes': '#d6d3d1',
            '--tw-prose-invert-quote-borders': '#44403c',
            '--tw-prose-invert-captions': '#a8a29e',
            '--tw-prose-invert-code': '#fafaf9',
            '--tw-prose-invert-pre-code': '#d6d3d1',
            '--tw-prose-invert-pre-bg': '#121215',
            '--tw-prose-invert-th-borders': '#44403c',
            '--tw-prose-invert-td-borders': '#292524',
            maxWidth: '65ch',
            lineHeight: '1.85',
            letterSpacing: '0.015em',
            fontSize: '1.03rem',
            'p, li': {
              fontStyle: 'normal !important',
            },
            blockquote: {
              fontStyle: 'italic',
              fontWeight: '400',
              borderLeftWidth: '2px',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              paddingLeft: '1.25rem',
            },
            h1: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.015em',
            },
            h3: {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", Georgia, serif',
              fontWeight: '600',
            },
            code: {
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontWeight: '500',
              fontSize: '0.875em',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(120, 113, 108, 0.1)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
