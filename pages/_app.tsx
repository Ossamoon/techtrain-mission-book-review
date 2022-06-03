import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </React.StrictMode>
  );
}
export default MyApp;
