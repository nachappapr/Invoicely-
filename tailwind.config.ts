import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        spartan: ["League Spartan", "sans-serif"],
      },
      boxShadow: {
        dropdownMenu: "0px 10px 20px 0px rgba(54, 78, 126, 0.25)",
      },
      colors: {
        "purple-1000": "#7C5DFA",
        "purple-1050": "#9277FF",
        "blue-1000": "#1E2139",
        "blue-1050": "#252945",
        "blue-2000": "#141625",
        "indigo-1000": "#DFE3FA",
        "indigo-1050": "#7E88C3",
        "indigo-2000": "#888EB0",
        "black-1000": "#0C0E16",
        "red-1000": "#EC5757",
        "red-1050": "#FF9797",
        "white-1000": "#F8F8FB",
        "gray-1000": "#494E6E",
        "gray-1050": "#373B53",
        "green-1000": "#33D69F",
        "orange-1000": "#FF8F00",
        "gray-2000": "#777F98",
        "ghost-white": "#F9FAFE",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
