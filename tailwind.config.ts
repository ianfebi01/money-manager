import type { Config } from 'tailwindcss'

const config: Config = {
  content : [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './assets/css/**/*.{css}',
  ],
  plugins : [],
  theme   : {
    extend : {
      transitionTimingFunction : {
        burger : 'cubic-bezier(.645, .045, .355, 1)',
      },
      backgroundImage : {
        'gradient-radial' : 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic' :
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dashed-line' : "url('/+++.svg')",
        plus          : "url('/+++.svg')",
      },
      colors : {
        dark              : '#222222',
        'dark-secondary'  : '#393939',
        orange            : '#F26B50',
        green             : '#4FAA84',
        white             : '#f1f1f1',
        'white-overlay'   : 'rgba(251, 251, 251, 0.40)',
        'white-overlay-2' : 'rgba(251, 251, 251, 0.20)',
      },
      boxShadow : {
        skill : '0px 1px 4px 1px rgba(34, 34, 34, 0.25)',
      },
      dropShadow : {
        '20'     : '0 0 20px rgba(5, 13, 39, 0.3)',
        '20-0.5' : '0 0 20px rgba(5, 13, 39, 0.5)',
      },
      fontFamily : {
        primary : [
          'Inter',
          'Arial',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
        code   : ['"Source Code Pro"'],
        roboto : ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
}
export default config
