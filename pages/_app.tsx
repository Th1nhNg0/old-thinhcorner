import type { AppProps } from "next/app";
import LayoutWrapper from "../components/LayoutWrapper";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="theme-first"
      themes={["theme-first", "theme-second"]}
    >
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  );
}

export default MyApp;
