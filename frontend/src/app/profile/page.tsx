"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", location: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
    if (user) setForm({ name: user.name, bio: user.bio || "", location: user.location || "", phone: user.phone || "" });
  }, [user, loading, router]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await usersApi.updateProfile(form);
      await refreshUser();
      setEditing(false);
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="mt-1">
                  {user.is_verified ? (
                    <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Unverified</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-brand-green"}`}>{message}</p>}

          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell the community about yourself..." />
              </div>
              <div className="space-y-2">
                <Label>Location (City/Town)</Label>
                <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Saskatoon, SK" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="306-555-0000" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Changes"}</Button>
            </>
          ) : (
            <div className="space-y-3 text-sm">
              {user.bio && <p className="text-gray-600">{user.bio}</p>}
              {user.location && <div className="flex items-center gap-2 text-gray-500"><MapPin className="h-4 w-4" /> {user.location}</div>}
              {user.phone && <div className="flex items-center gap-2 text-gray-500"><Phone className="h-4 w-4" /> {user.phone}</div>}
              {!user.bio && !user.location && !user.phone && <p className="text-gray-400">No profile information yet. Click Edit Profile to add details.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
