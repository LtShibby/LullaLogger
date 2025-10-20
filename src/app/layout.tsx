import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LullaLog",
  description: "Local-first baby tracker",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="neutral">
      <body>
        {children}
        <div id="__toast-root"></div>
        <script dangerouslySetInnerHTML={{ __html: swRegister }} />
      </body>
    </html>
  );
}

const swRegister = `
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
`;

