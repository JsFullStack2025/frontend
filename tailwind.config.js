/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              'color': 'inherit',
              'textDecoration': 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            },
            blockquote: {
              borderLeftColor: 'currentColor',
              fontStyle: 'italic',
            },
            code: {
              color: 'inherit',
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '0.25rem',
              padding: '0.25rem',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 