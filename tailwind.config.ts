import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-tint": "var(--foreground-tint)",
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "intense-background": "var(--intense-background)",
      },
    },
  },
  plugins: [],
};
export default config;
