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
          card: 'rgba(255, 255, 255, 0.88)',
          dark: '#0B111A',
          'dark-card': 'rgba(18, 27, 44, 0.82)',
          border: 'rgba(203, 219, 235, 0.75)',
          'dark-border': 'rgba(56, 78, 108, 0.6)',
        },
      },
      fontFamily: {
        serif: [
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
          'MiSans',
          'MiSans Normal',
          'MiSans-Normal',
          'MiSans VF',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'monospace',
          'sans-serif',
        ],
      },
      typography: () => ({
        paper: {
          css: {
            '--tw-prose-body': '#334155', // slate-700
            '--tw-prose-headings': '#0f172a', // slate-900
            '--tw-prose-lead': '#475569', // slate-600
            '--tw-prose-links': '#0f172a',
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
            '--tw-prose-invert-body': '#cbd5e1',
            '--tw-prose-invert-headings': '#f8fafc',
            '--tw-prose-invert-lead': '#94a3b8',
            '--tw-prose-invert-links': '#f8fafc',
            '--tw-prose-invert-bold': '#f8fafc',
            '--tw-prose-invert-counters': '#94a3b8',
            '--tw-prose-invert-bullets': '#475569',
            '--tw-prose-invert-hr': '#334155',
            '--tw-prose-invert-quotes': '#cbd5e1',
            '--tw-prose-invert-quote-borders': '#334155',
            '--tw-prose-invert-captions': '#94a3b8',
            '--tw-prose-invert-code': '#f8fafc',
            '--tw-prose-invert-pre-code': '#cbd5e1',
            '--tw-prose-invert-pre-bg': '#0b111a',
            '--tw-prose-invert-th-borders': '#334155',
            '--tw-prose-invert-td-borders': '#334155',
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
              fontFamily: 'MiSans, "MiSans Normal", "MiSans-Normal", "MiSans VF", monospace, sans-serif',
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
