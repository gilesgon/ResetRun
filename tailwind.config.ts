import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0A0A0A',
        calm: {
          from: 'rgba(37, 99, 235, 0.2)',
          to: 'rgba(139, 92, 246, 0.2)',
        },
        focus: {
          from: 'rgba(245, 158, 11, 0.2)',
          to: 'rgba(249, 115, 22, 0.2)',
        },
        clean: {
          from: 'rgba(16, 185, 129, 0.2)',
          to: 'rgba(20, 184, 166, 0.2)',
        },
        body: {
          from: 'rgba(239, 68, 68, 0.2)',
          to: 'rgba(236, 72, 153, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
