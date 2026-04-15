/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0B0E14", light: "#12161F" },
        surface: { DEFAULT: "#12161F", hover: "#1A1F2E" },
        card: "#151A26",
        border: { DEFAULT: "#1E2536", light: "#2A3348" },
        gold: { DEFAULT: "#D4A843", dim: "rgba(212,168,67,0.12)", glow: "rgba(212,168,67,0.25)" },
        txt: { DEFAULT: "#E8ECF4", muted: "#7A8599", dim: "#4A5568" },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: "0", transform: "translateX(-10px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
