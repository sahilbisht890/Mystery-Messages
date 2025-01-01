import Navbar from "@/components/navbar";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
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
          <Footer/>
          <Toaster position="top-right" reverseOrder={false} />{" "}
        </body>
      </AuthProvider>
    </html>
  );
}
