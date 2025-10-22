import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: '#1e40af',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
