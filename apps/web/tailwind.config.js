/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // Cores principais da marca Nexus
      colors: {
        primary: {
          DEFAULT: "#6C3BFF",
          50: "#F0EEFF",
          100: "#E5E1FF",
          200: "#D1CCFF",
          300: "#B8B2FF",
          400: "#9F93FF",
          500: "#8B79FF",
          600: "#6C3BFF",
          700: "#5A2EE8",
          800: "#4823D0",
          900: "#3619B9",
        },
        secondary: {
          DEFAULT: "#FF6B6B",
          50: "#FFF0F0",
          100: "#FFE6E6",
          200: "#FFD4D4",
          300: "#FFB8B8",
          400: "#FF9B9B",
          500: "#FF7F7F",
          600: "#FF6B6B",
          700: "#E85A5A",
          800: "#D04A4A",
          900: "#B93B3B",
        },
        accent: {
          DEFAULT: "#00D4AA",
          50: "#E6FAF5",
          100: "#CCF5EB",
          200: "#99EBD7",
          300: "#66E0C3",
          400: "#33D6AF",
          500: "#00CC9C",
          600: "#00D4AA",
          700: "#00B894",
          800: "#009C78",
          900: "#00805D",
        },
        neutral: {
          DEFAULT: "#1A1A2E",
          50: "#F5F5F7",
          100: "#EBEBEF",
          200: "#D8D8E0",
          300: "#B8B8C2",
          400: "#8E8E9A",
          500: "#6B6B78",
          600: "#4D4D58",
          700: "#36363F",
          800: "#1A1A2E",
          900: "#0D0D17",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      // Border radius
      borderRadius: {
        brand: "9999px",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      // Sombras personalizadas
      boxShadow: {
        brand: "0 4px 20px rgba(108, 59, 255, 0.25)",
        "brand-lg": "0 8px 30px rgba(108, 59, 255, 0.35)",
        "brand-sm": "0 2px 10px rgba(108, 59, 255, 0.15)",
        secondary: "0 4px 20px rgba(255, 107, 107, 0.25)",
        accent: "0 4px 20px rgba(0, 212, 170, 0.25)",
      },
      // Espaçamento
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      // Tipografia
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      // Animações
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        nexus: {
          primary: "#6C3BFF",
          "primary-content": "#ffffff",
          secondary: "#FF6B6B",
          "secondary-content": "#ffffff",
          accent: "#00D4AA",
          "accent-content": "#ffffff",
          neutral: "#1A1A2E",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F5F5F7",
          "base-300": "#EBEBEF",
          "base-content": "#1A1A2E",
          success: "#22C55E",
          "success-content": "#ffffff",
          warning: "#F59E0B",
          "warning-content": "#1A1A2E",
          error: "#EF4444",
          "error-content": "#ffffff",
          info: "#3B82F6",
          "info-content": "#ffffff",
        },
      },
    ],
  },
};
