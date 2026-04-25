/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black & White Elegant Palette
        primary: '#000000',
        'primary-light': '#333333',
        background: '#FFFFFF',
        foreground: '#000000',
        surface: '#FAFAFA',
        success: '#000000',
        warning: '#666666',
        danger: '#000000',
        info: '#333333',
        title: '#000000',
        text: '#1a1a1a',
        muted: '#666666',
        border: '#E5E5E5',
        
        // Pastel colors mapped to B&W
        'pastel-green': '#F5F5F5',
        'pastel-blue': '#000000',
        'pastel-dark-blue': '#1a1a1a',
        'pastel-red': '#333333',
        
        // Sidebar
        'sidebar-bg': '#FAFAFA',
        'sidebar-text': '#000000',
        'sidebar-hover': '#F0F0F0',
        'sidebar-active-bg': '#000000',
        'sidebar-active-text': '#FFFFFF',
        'sidebar-active-border': '#000000',
        
        // Topbar
        'topbar-bg': '#FFFFFF',
        
        // Button
        'button-bg': '#000000',
        'button-text': '#FFFFFF',
        'button-hover-bg': '#333333',
        
        // Chart colors
        'chart-1': '#000000',
        'chart-2': '#333333',
        'chart-3': '#666666',
        'chart-4': '#999999',
        'chart-5': '#CCCCCC',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0, 0, 0, 0.08)',
        medium: '0 8px 32px rgba(0, 0, 0, 0.12)',
        large: '0 12px 48px rgba(0, 0, 0, 0.16)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'fadeInDown': 'fadeInDown 0.8s ease-out forwards',
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'scaleIn': 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slideInLeft': 'slideInLeft 0.8s ease-out forwards',
        'slideInRight': 'slideInRight 0.8s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
