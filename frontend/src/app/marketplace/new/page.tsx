"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { marketplaceApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = ["Local Goods","Agricultural Equipment","Construction Services","Homemade Food","Second-Hand Goods","Local Services","Manufacturing Machinery","Event Planning"] as const;

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  price_unit: z.string().optional(),
  category: z.enum(CATEGORIES),
  location: z.string().min(2, "Location is required"),
});
type FormData = z.infer<typeof schema>;

export default function NewListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!user) { router.push("/auth/login"); return null; }

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && form.append(k, String(v)));
      const { data: resp } = await marketplaceApi.createListing(form);
      router.push(`/marketplace/${resp.listing.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Listing</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</p>}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="What are you selling?" {...register("title")} />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Describe your item..." {...register("description")} />
              {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" placeholder="0.00" {...register("price")} />
                {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Price Unit (optional)</Label>
                <Input placeholder="e.g. /hr, /dozen" {...register("price_unit")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register("category")}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Location (City/Town)</Label>
              <Input placeholder="e.g. Saskatoon, SK" {...register("location")} />
              {errors.location && <p className="text-xs text-red-600">{errors.location.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Post Listing"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
