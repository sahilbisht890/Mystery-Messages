import Navbar from "@/components/navbar";
import AuthProvider from "@/context/AuthProvider";
import './globals.css';
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <AuthProvider>
        <body>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
          </div>
          <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
          © 2023 True Feedback. All rights reserved.
            </footer>
        </body>
      </AuthProvider>
    </html>
  );
}
