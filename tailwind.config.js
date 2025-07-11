module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './stories/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/container-queries')],
  corePlugins: {
    preflight: true,
  },
  prefix: 'us-',
};
