import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <CookiesProvider>
        <Toaster />
        <Component {...pageProps} />
      </CookiesProvider>
    </React.StrictMode>
  );
}
export default MyApp;
