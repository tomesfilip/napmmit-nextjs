import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      snowWhite: '#F9FFFF',
      gunmetalBlack: '#183032',
      tomatoPink: '#FB6C4A',
      orange: '#F3A503',
      green: '#009B72',
    },
  },
  plugins: [],
};
export default config;
