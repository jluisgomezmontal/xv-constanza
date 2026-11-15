import type { Metadata } from "next";
import data from "@/data/invitation.json";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://xv-constanza-tau.vercel.app"),
  title: data.metadata.title,
  description: data.metadata.description,
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    title: data.metadata.title,
    description: data.metadata.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
