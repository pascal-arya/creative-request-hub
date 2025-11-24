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
        dwdg: {
          green: '#00B887',       // Gradient Start
          black: '#000503',       // Your Black
          lightgreen: '#64C07A',  // Gradient End
          form: '#F4F4F4',        // Form Fill
        }
      },
      backgroundImage: {
        'dwdg-gradient-1': 'linear-gradient(to bottom, #00B887 0%, #000503 72.6%)',
        'dwdg-gradient-2': 'linear-gradient(to right, #FFFFFF 0%, #64C07A 100%)',
      },
    },
  },
  plugins: [],
};
export default config;