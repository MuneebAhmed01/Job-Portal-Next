import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import GoogleAuthProvider from "@/providers/GoogleAuthProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({ 
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  title: "JobForge - Find Your Dream Job",
  description: "#1 AI-Powered Job Platform in India - Connect with top employers and transform your career with advanced AI tools",
  keywords: ["jobs", "career", "AI", "resume analyzer", "career guidance", "hiring", "recruitment"],
  authors: [{ name: "JobForge Team" }],
  openGraph: {
    title: "JobForge - AI-Powered Job Platform",
    description: "Find your dream job with AI-powered career guidance and resume optimization",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          <ThemeProvider>
            <GoogleAuthProvider>
            <AuthProvider>
              
              <main>
                {children}
              </main>
              <Footer/>
              <BackToTop />
            </AuthProvider>
            </GoogleAuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
