import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Ms_Madi,
  Caveat,
  Poppins,
  Playwrite_ES_Deco,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HelloScreen } from "@/components/hello-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const msMadi = Ms_Madi({
  variable: "--font-ms-madi",
  subsets: ["latin"],
  weight: "400",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playwriteEsDeco = Playwrite_ES_Deco({
  variable: "--font-playwrite-es-deco",
  weight: ["100", "200", "300", "400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siddhesh.dev"),
  title: {
    default: "Siddhesh Shinde",
    template: "%s | Siddhesh Shinde",
  },
  description:
    "Personal portfolio and blog by Siddhesh. Building apps and SaaS products that matter. Competitive Programming, Full-Stack Engineering, and Daily Learning.",
  keywords: [
    "Siddhesh",
    "developer",
    "portfolio",
    "full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "competitive programming",
    "SaaS",
    "blog",
    "system design",
    "web development",
    "Node.js",
    "Supabase",
  ],
  authors: [{ name: "Siddhesh", url: "https://siddhesh-portfolio-plum.vercel.app/" }],
  creator: "Siddhesh",
  publisher: "Siddhesh",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Siddhesh Shinde",
    description:
      "Building apps and SaaS products that matter. Full-Stack Engineer & Competitive Programmer.",
    url: "https://siddhesh-portfolio-plum.vercel.app/",
    siteName: "Siddhesh Shinde",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddhesh Shinde",
    description: "Building apps and SaaS products that matter.",
    creator: "@Siddhesh_2110",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${msMadi.variable} ${caveat.variable} ${poppins.variable} ${playwriteEsDeco.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://tbktgklroiyglzdqjxtg.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <HelloScreen />
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
