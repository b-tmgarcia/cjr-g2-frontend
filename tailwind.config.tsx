import type { Config } from "tailwindcss";
 
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ["var(--font-league-spartan)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
 
export default config;
