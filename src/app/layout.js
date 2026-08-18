import "./globals.css";

export const metadata = {
  title: "VibeSubreddit",
  description: "Discover the vibe of any subreddit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}