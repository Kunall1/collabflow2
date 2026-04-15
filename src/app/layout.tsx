import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "CollabFlow — Influencer Brand Collaboration Dashboard",
  description: "Track campaigns, manage deliverables, monitor payments, and grow brand relationships from one command center.",
  openGraph: {
    title: "CollabFlow — Influencer Brand Collaboration Dashboard",
    description: "Your brand deals, orchestrated.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
