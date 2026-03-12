import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Claude Builders' Club — University of Ghana",
  description:
    "A student community at the University of Ghana building with AI, powered by Claude and Anthropic.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
