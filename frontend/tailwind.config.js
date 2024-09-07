 // tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      animation: {
        'rotate-one': 'rotate-one 1s linear infinite',
        'rotate-two': 'rotate-two 1s linear infinite',
        'rotate-three': 'rotate-three 1s linear infinite',
      },
      keyframes: {
        'rotate-one': {
          '0%': { transform: 'rotateX(35deg) rotateY(-45deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(35deg) rotateY(-45deg) rotateZ(360deg)' },
        },
        'rotate-two': {
          '0%': { transform: 'rotateX(50deg) rotateY(10deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(50deg) rotateY(10deg) rotateZ(360deg)' },
        },
        'rotate-three': {
          '0%': { transform: 'rotateX(35deg) rotateY(55deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(35deg) rotateY(55deg) rotateZ(360deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
