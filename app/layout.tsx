import type { Metadata } from "next";
import "./globals.css";
import FooterModal from "@/components/FooterModal";

export const metadata: Metadata = {
  title: "SnapTools | Zero-Server Smart Client Utilities",
  description: "Next-gen browser utilities, creator studio, and privacy-first client tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#08090d] text-slate-100 min-h-screen antialiased selection:bg-cyan-400 selection:text-black flex flex-col justify-between">
        <div className="flex-1">
          {children}
        </div>
        <FooterModal />
      </body>
    </html>
  );
}