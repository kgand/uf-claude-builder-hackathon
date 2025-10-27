"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/cdrive.png"
              alt="C-Drive Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              C-Drive
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200",
                isActive("/")
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
              )}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200",
                isActive("/about")
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
              )}
            >
              About
            </Link>
            <Link
              href="/docs"
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200",
                isActive("/docs")
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
              )}
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

