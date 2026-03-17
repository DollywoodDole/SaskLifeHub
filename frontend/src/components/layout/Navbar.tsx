"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-blue">Sask</span>
            <span className="text-2xl font-bold text-brand-green">LifeHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Marketplace</Link>
            <Link href="/utilities" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Utilities</Link>
            <Link href="/finances" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Finances</Link>
            <Link href="/health" className="text-sm font-medium text-gray-600 hover:text-brand-blue">Health</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/notifications">
                  <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link href="/auth/signup"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          <Link href="/marketplace" className="block py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          <Link href="/utilities" className="block py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Utilities</Link>
          <Link href="/finances" className="block py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Finances</Link>
          <Link href="/health" className="block py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Health</Link>
          <div className="pt-2 border-t flex gap-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={logout} className="w-full">Sign Out</Button>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link>
                <Link href="/auth/signup" className="flex-1"><Button size="sm" className="w-full">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
