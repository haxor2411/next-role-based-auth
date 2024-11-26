import { cn } from "@/lib/utils";
import AuthProvider from "./(components)/AuthProvider";
import Nav from "./(components)/Nav";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata = {
  title: "Role Based Access Control",
  description: "Project Assignment for Role Based Access Control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* NOTE Wrapping the Nav and Components for client slide authentication  
      - If i only want to make Body client side authentication then only wrapped around body 
      */}
      <AuthProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {/* Navbar Component */}

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Body of the website */}
            <Nav />
            <div className="m-2"> {children}</div>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
