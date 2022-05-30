function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

let themeColors = {
  base: withOpacityValue("--color-base"),
  surface: withOpacityValue("--color-surface"),
  overlay: withOpacityValue("--color-overlay"),
  muted: withOpacityValue("--color-muted"),
  subtle: withOpacityValue("--color-subtle"),
  text: withOpacityValue("--color-text"),
  love: withOpacityValue("--color-love"),
  gold: withOpacityValue("--color-gold"),
  rose: withOpacityValue("--color-rose"),
  pine: withOpacityValue("--color-pine"),
  foam: withOpacityValue("--color-foam"),
  iris: withOpacityValue("--color-iris"),
  "hightlight-low": withOpacityValue("--color-hightlight-low"),
  "hightlight-med": withOpacityValue("--color-hightlight-med"),
  "hightlight-high": withOpacityValue("--color-hightlight-high"),
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColors,
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
