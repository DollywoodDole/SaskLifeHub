"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap, Heart, DollarSign, Bell, Plus, ArrowRight } from "lucide-react";

const quickLinks = [
  { title: "Marketplace", desc: "Browse and post listings", href: "/marketplace", icon: ShoppingBag, color: "text-brand-blue", bg: "bg-blue-50" },
  { title: "Utilities", desc: "Manage your bills", href: "/utilities", icon: Zap, color: "text-brand-amber", bg: "bg-amber-50" },
  { title: "Finances", desc: "Track budget & tools", href: "/finances", icon: DollarSign, color: "text-brand-green", bg: "bg-green-50" },
  { title: "Health", desc: "Appointments & wellness", href: "/health", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening in your Saskatchewan community.</p>
      </div>

      {!user.is_verified && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
          <p className="text-sm text-amber-800">Please verify your email to access all features.</p>
          <Link href={`/auth/verify-email?email=${encodeURIComponent(user.email)}`}>
            <Button size="sm" variant="amber">Verify Now</Button>
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${link.bg}`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Post a Listing</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Sell goods or offer services to the Saskatchewan community.</p>
            <Link href="/marketplace/new"><Button><Plus className="mr-2 h-4 w-4" /> Create Listing</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Notifications</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Check your latest updates and messages.</p>
            <Link href="/notifications"><Button variant="outline"><Bell className="mr-2 h-4 w-4" /> View Notifications</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
