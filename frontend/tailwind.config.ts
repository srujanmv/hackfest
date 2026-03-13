import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        bg: "#0B0F1A",
        primary: "#4F8CFF",
        secondary: "#00E5FF",
        warning: "#FFC107",
        danger: "#FF4D4D",
        success: "#22C55E",
        text: "#FFFFFF"
      },
      boxShadow: {
        glow: "0 0 25px rgba(79, 140, 255, 0.35)",
        glowStrong: "0 0 40px rgba(0, 229, 255, 0.35)",
        glowSoft: "0 0 60px rgba(79, 140, 255, 0.18)"
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(600px circle at var(--mx, 50%) var(--my, 20%), rgba(79,140,255,0.22), transparent 40%)",
        "hero-sheen":
          "radial-gradient(900px circle at 20% 10%, rgba(0,229,255,0.18), transparent 40%), radial-gradient(900px circle at 80% 30%, rgba(79,140,255,0.20), transparent 40%)"
      }
    }
  },
  plugins: []
} satisfies Config;

