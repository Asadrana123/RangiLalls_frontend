module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d12b3f',
          dark: '#b82537',    // darker shade for hover
          light: '#fff5f6',   // lighter shade for backgrounds
        },
        orange: {
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        }
      }
    }
  },
  plugins: [],
}