import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Zap, Heart, DollarSign, ArrowRight, MapPin } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Marketplace Agora",
    description: "Buy, sell, and trade locally. From farm produce to agricultural equipment, homemade food to professional services.",
    href: "/marketplace",
    color: "text-brand-blue",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Utilities Hub",
    description: "Manage SaskPower, SaskEnergy, SaskTel, and water bills in one place. Track due dates and pay with ease.",
    href: "/utilities",
    color: "text-brand-amber",
    bg: "bg-amber-50",
  },
  {
    icon: DollarSign,
    title: "Financial Agora",
    description: "Budget tracker, tax calculator, investment monitor, peer-to-peer financial advice, and local opportunities.",
    href: "/finances",
    color: "text-brand-green",
    bg: "bg-green-50",
  },
  {
    icon: Heart,
    title: "Health Agora",
    description: "Doctor bookings, health records, wellness tracker, mental health resources, and prescription management.",
    href: "/health",
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

const categories = [
  "Local Goods", "Agricultural Equipment", "Construction Services",
  "Homemade Food", "Second-Hand Goods", "Local Services",
  "Manufacturing Machinery", "Event Planning",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue to-brand-green px-4 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-brand-amber">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Saskatchewan, Canada</span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Saskatchewan's All-in-One<br />
            <span className="text-brand-amber">Services Hub</span>
          </h1>
          <p className="mb-10 text-lg text-blue-100 max-w-2xl mx-auto">
            SaskLifeHub connects you to your community — buy, sell, track utilities, manage finances, and access health services, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="amber" className="w-full sm:w-auto text-base">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-white/10 border-white text-white hover:bg-white/20">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything Saskatchewan Needs</h2>
          <p className="mt-2 text-gray-500">Four pillars powering your community life</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${f.bg}`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-brand-blue transition-colors">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{f.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Marketplace Categories */}
      <section className="bg-white py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Marketplace Categories</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Link key={cat} href={`/marketplace?category=${encodeURIComponent(cat)}`}>
                <span className="rounded-full border border-brand-blue px-4 py-2 text-sm text-brand-blue hover:bg-brand-blue hover:text-white transition-colors cursor-pointer">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/marketplace">
              <Button variant="default">View All Listings <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-green py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to join your community?</h2>
        <p className="mb-8 text-green-100">Create your free account and start connecting with Saskatchewan.</p>
        <Link href="/auth/signup">
          <Button size="lg" variant="amber">Create Free Account</Button>
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2025 SaskLifeHub. Built for Saskatchewan. MIT License.</p>
      </footer>
    </div>
  );
}
