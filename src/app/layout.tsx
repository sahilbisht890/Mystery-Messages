import Navbar from "@/components/navbar";
import AuthProvider from "@/context/AuthProvider";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <AuthProvider>
        <body>
          <div className="flex flex-col min-h-screen  bg-gray-800">
            <Navbar />
            {children}
          </div>
          <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
          © 2023 True Feedback. All rights reserved.
            </footer>
            <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
