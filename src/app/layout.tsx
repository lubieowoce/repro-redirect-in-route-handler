import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "redirect() in route handlers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "monospace" }}>{children}</body>
    </html>
  );
}
