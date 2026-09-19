/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces. Cool neutrals only — no cream or beige.
        paper: '#FFFFFF',
        haze: '#F4F6F8',
        frame: '#E4E8EC',
        ink: '#0A0B0D',
        // Primary action. charge on white is 6.3:1 with white text; chargeDeep is the
        // text-safe variant on light surfaces; chargeLight is for dark sections.
        charge: '#0047FF',
        chargeDeep: '#0035C4',
        chargeLight: '#7FA8FF',
        // Sale and urgency only. Always pair flame with ink text — white on flame is 3.6:1.
        flame: '#FF3B00',
        flameDeep: '#C42D00',
        success: '#0E7C4A',
        danger: '#C1121F',
        warning: '#8A5A00',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        store: '1440px',
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(10, 11, 13, 0.35)',
        drawer: '-20px 0 60px rgba(10, 11, 13, 0.25)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        kenburns: 'kenburns 18s ease-out forwards',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
