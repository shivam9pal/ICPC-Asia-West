import { Inter, Archivo_Black, Open_Sans } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-archivo-black',
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: '--font-open-sans',
});

export const metadata = {
  title: "ICPC Asia West Continent",
  description: "The premier programming contest for university students across the Asia West region",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${archivoBlack.variable} ${openSans.variable} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
