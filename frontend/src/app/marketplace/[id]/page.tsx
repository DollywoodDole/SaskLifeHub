"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Listing } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Tag, User, ArrowLeft, ShoppingCart } from "lucide-react";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    marketplaceApi.getListing(id)
      .then(({ data }) => setListing(data.listing))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleOrder() {
    if (!user) { router.push("/auth/login"); return; }
    setOrdering(true);
    try {
      await marketplaceApi.createOrder(id);
      setOrdered(true);
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!listing) return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <p className="text-gray-400 text-lg">Listing not found.</p>
      <Button variant="outline" className="mt-4" onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="h-64 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <p className="text-gray-300 text-sm">No image</p>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-brand-blue">
                  ${listing.price.toLocaleString()}{listing.price_unit && <span className="text-lg font-normal text-gray-500">{listing.price_unit}</span>}
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-gray-400" /> {listing.category}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> {listing.location}</div>
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> {listing.seller_name}</div>
              </div>
              <Badge variant={listing.status === "active" ? "secondary" : "outline"}>{listing.status}</Badge>
              {ordered ? (
                <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">Order placed! The seller will contact you.</div>
              ) : (
                <Button className="w-full" onClick={handleOrder} disabled={ordering || listing.status !== "active"}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {ordering ? "Placing order..." : "Contact Seller / Order"}
                </Button>
              )}
              {!user && <p className="text-xs text-gray-400 text-center">Sign in to contact the seller</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
