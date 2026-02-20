import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "LexEditor — Rich Text Editor",
  description: "Rich Text Editor built with Lexical, supporting tables, LaTeX math, and more.",
  authors: [{ name: "LexEditor Team" }],
  openGraph: {
    title: "LexEditor App",
    description: "Rich Text Editor built with Lexical",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
