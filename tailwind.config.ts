import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      spartan: ["League Spartan", "sans-serif"],
    },
    extend: {
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
      },
    },
  },
  plugins: [],
} satisfies Config;
