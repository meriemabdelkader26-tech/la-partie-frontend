/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D5A5B',
        'primary-light': '#5F7D7E',
        background: '#F7FAF9',
        surface: '#FFFFFF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        title: '#1F2937',
        text: '#3D5A5B',
        muted: '#A0B1AA',
        border: '#D1E3DB',
        'sidebar-bg': '#EAF3EF',
        'sidebar-text': '#3D5A5B',
        'sidebar-hover': '#D1E3DB',
        'sidebar-active-bg': '#FFFFFF',
        'sidebar-active-text': '#3D5A5B',
        'sidebar-active-border': '#3D5A5B',
        'topbar-bg': '#FFFFFF',
        'card-bg': 'linear-gradient(135deg, #F7FAF9 0%, #EAF3EF 100%)',
        'button-bg': '#3D5A5B',
        'button-text': '#FFFFFF',
        'button-hover-bg': '#5F7D7E',
        // Chart colors
        'chart-1': '#3D5A5B',
        'chart-2': '#5F7D7E',
        'chart-3': '#22C55E',
        'chart-4': '#F59E0B',
        'chart-5': '#3B82F6',
      },
      borderRadius: {
        xl: '16px',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(60,60,60,0.07)',
      },
    },
  },
  plugins: [],
};
