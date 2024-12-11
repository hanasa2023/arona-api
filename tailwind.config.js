/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /bg-(red|orange|blue|yellow)-(400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {
      clipPath: {
        hexagon:
          'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      },
    },
  },
  plugins: [require('tailwind-clip-path')],
}
