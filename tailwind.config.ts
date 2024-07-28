import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      container: {
        padding: "1rem",
        center: true,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("progress-unfilled", ["&::-webkit-progress-bar", "&"]);
      addVariant("progress-filled", [
        "&::-webkit-progress-value",
        "&::-moz-progress-bar",
      ]);
    }),
  ],
} satisfies Config;
