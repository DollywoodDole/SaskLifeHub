"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Listing, ListingCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MapPin, Tag } from "lucide-react";

const CATEGORIES: ListingCategory[] = [
  "Local Goods", "Agricultural Equipment", "Construction Services",
  "Homemade Food", "Second-Hand Goods", "Local Services",
  "Manufacturing Machinery", "Event Planning",
];

const STATIC_LISTINGS: Listing[] = [
  { id: "1", title: "Handmade Pottery", description: "Beautiful hand-crafted pottery made locally in Saskatchewan.", price: 25, category: "Local Goods", location: "Saskatoon", images: [], seller_id: "1", seller_name: "Local Artisan", status: "active", created_at: new Date().toISOString() },
  { id: "2", title: "John Deere Tractor", description: "Well-maintained John Deere tractor, perfect for farm work.", price: 5000, category: "Agricultural Equipment", location: "Regina", images: [], seller_id: "2", seller_name: "Farm Supply Co.", status: "active", created_at: new Date().toISOString() },
  { id: "3", title: "Contractor for Hire", description: "Experienced contractor available for residential and commercial projects.", price: 50, price_unit: "/hr", category: "Construction Services", location: "Moose Jaw", images: [], seller_id: "3", seller_name: "Pro Builders", status: "active", created_at: new Date().toISOString() },
  { id: "4", title: "Homemade Perogies", description: "Fresh homemade perogies, multiple flavours available.", price: 10, price_unit: "/dozen", category: "Homemade Food", location: "Prince Albert", images: [], seller_id: "4", seller_name: "Grandma's Kitchen", status: "active", created_at: new Date().toISOString() },
  { id: "5", title: "Used Dining Table", description: "Solid wood dining table, seats 6, minor scratches.", price: 200, category: "Second-Hand Goods", location: "Saskatoon", images: [], seller_id: "5", seller_name: "Moving Sale", status: "active", created_at: new Date().toISOString() },
  { id: "6", title: "Lawn Mowing Service", description: "Professional lawn care for residential properties.", price: 30, category: "Local Services", location: "Regina", images: [], seller_id: "6", seller_name: "Green Thumb", status: "active", created_at: new Date().toISOString() },
  { id: "7", title: "Electric Motor", description: "Industrial electric motor, 5HP, good condition.", price: 800, category: "Manufacturing Machinery", location: "Swift Current", images: [], seller_id: "7", seller_name: "Industrial Surplus", status: "active", created_at: new Date().toISOString() },
  { id: "8", title: "Community Workshop", description: "Learn woodworking basics in a fun community setting.", price: 15, category: "Event Planning", location: "Lloydminster", images: [], seller_id: "8", seller_name: "Community Centre", status: "active", created_at: new Date().toISOString() },
];

function MarketplaceContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(STATIC_LISTINGS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    marketplaceApi.getListings({ category: activeCategory || undefined, search: search || undefined })
      .then(({ data }) => setListings(data.listings || STATIC_LISTINGS))
      .catch(() => {
        let filtered = STATIC_LISTINGS;
        if (activeCategory) filtered = filtered.filter(l => l.category === activeCategory);
        if (search) filtered = filtered.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()));
        setListings(filtered);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Agora</h1>
          <p className="text-gray-500">Your local hub for buying, selling, and trading in Saskatchewan</p>
        </div>
        {user && (
          <Link href="/marketplace/new">
            <Button><Plus className="mr-2 h-4 w-4" /> List Item</Button>
          </Link>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!activeCategory ? "bg-brand-blue text-white" : "border border-gray-300 text-gray-600 hover:border-brand-blue hover:text-brand-blue"}`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat ? "bg-brand-blue text-white" : "border border-gray-300 text-gray-600 hover:border-brand-blue hover:text-brand-blue"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No listings found.</p>
          {user && <Link href="/marketplace/new"><Button className="mt-4"><Plus className="mr-2 h-4 w-4" /> Be the first to list</Button></Link>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/marketplace/${listing.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-36 bg-gradient-to-br from-blue-50 to-green-50 rounded-t-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-1">{listing.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-brand-blue font-bold text-lg">
                    ${listing.price.toLocaleString()}{listing.price_unit && <span className="text-sm font-normal text-gray-500">{listing.price_unit}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs"><Tag className="mr-1 h-3 w-3" />{listing.category}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" /></svg>;
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
