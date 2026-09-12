import type { Metadata } from "next";
import "./globals.css";

// SEO: fill these in once the theme/tagline is locked with the team.
// This metadata applies to every page unless a page exports its own.
export const metadata: Metadata = {
  title: "Life RPG — Turn Your To-Do List Into a Game",
  description:
    "Level up your real life. Life RPG turns everyday tasks into quests, tracks streaks, and levels up your character stats as you build habits that stick.",
  openGraph: {
    title: "Life RPG — Turn Your To-Do List Into a Game",
    description:
      "Level up your real life. Complete quests, build streaks, and grow your character stats.",
    type: "website",
    // images: ["/og-image.png"], // add once Teammate A has a hero image
  },
  twitter: {
    card: "summary_large_image",
    title: "Life RPG",
    description: "Turn your to-do list into a game.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>{/* Nav owned by UI/UX teammate for styling */}</header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
