const siteMetadata = {
  title: "Thịnh's Corner",
  author: "Thịnh Ngô",
  headerTitle: "Thịnh's Corner",
  description: "Góc nhỏ của Thịnh.",
  language: "en-us",
  siteUrl: "https://thinhcorner.com",
  siteRepo: "https://github.com/Th1nhNg0/th1nhng0.vercel.app",
  siteLogo: "/static/images/logo.png",
  image: "/static/images/avatar.png",
  socialBanner: "/static/images/socialbg.png",

  email: "thinhngow@gmail.com",
  github: "https://github.com/th1nhng0",
  // twitter: 'https://twitter.com/Twitter',
  facebook: "https://facebook.com/th1nhng0",
  // youtube: 'https://youtube.com',
  linkedin: "http://linkedin.com/in/thinhngow",
  spotify: "https://open.spotify.com/user/21acs5sngq2xkehugtvqkwmuy",
  // steam: "https://steamcommunity.com/id/th1nhng0/",

  locale: "en-US",
  analytics: {
    // supports plausible, simpleAnalytics or googleAnalytics
    plausibleDataDomain: "https://thinhcorner.com", // e.g. tailwind-nextjs-starter-blog.vercel.app
    simpleAnalytics: false, // true or false
    googleAnalyticsId: "G-P4B7XCWCYP", // e.g. UA-000000-2 or G-XXXXXXX
  },
  comment: {
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: "giscus", // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: "pathname", // supported options: pathname, url, title
      reactions: "1", // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: "0",
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: "light",
      // theme when dark mode
      darkTheme: "transparent_dark",
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: "",
    },
    utterancesConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://utteranc.es/
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO,
      issueTerm: "", // supported options: pathname, url, title
      label: "", // label (optional): Comment 💬
      // theme example: github-light, github-dark, preferred-color-scheme
      // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
      theme: "",
      // theme when dark mode
      darkTheme: "",
    },
    disqus: {
      // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      shortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
    },
  },
};

module.exports = siteMetadata;
