import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { AuthListener } from "@/components/AuthListener";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
});

const sans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://liferpg.app"),
  title: "Life RPG — Turn Your To-Do List Into a Quest Log",
  description:
    "Life RPG turns everyday tasks into quests. Complete them to earn XP and gold, level up a character, build streaks, and spend your gold in the shop.",
  openGraph: {
    title: "Life RPG — Turn Your To-Do List Into a Quest Log",
    description:
      "Complete real tasks, earn XP and gold, level up a character, and keep your streak alive.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life RPG",
    description: "Turn your to-do list into a quest log.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AuthProvider>
          <AuthListener />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
