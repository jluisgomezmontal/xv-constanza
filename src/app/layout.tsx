import type { Metadata } from "next";
import data from "@/data/invitation.json";
import "./globals.css";

export const metadata: Metadata = { title: data.metadata.title, description: data.metadata.description };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
