import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixel Studio - Professional Image Editor',
  description: 'A browser-based professional image editing application built with Next.js & React.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
};