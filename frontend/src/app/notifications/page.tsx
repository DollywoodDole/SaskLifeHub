"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { notificationsApi } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, ShoppingBag, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = { listing: ShoppingBag, order: ShoppingBag, message: MessageSquare, system: Settings };

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    notificationsApi.getAll()
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([
        { id: "1", user_id: user.id, type: "system", title: "Welcome to SaskLifeHub!", body: "Thanks for joining Saskatchewan's all-in-one services hub.", read: false, created_at: new Date().toISOString() },
        { id: "2", user_id: user.id, type: "listing", title: "Marketplace is live", body: "Browse local listings or post your own items for sale.", read: true, created_at: new Date().toISOString() },
      ]))
      .finally(() => setFetching(false));
  }, [user]);

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead();
      setNotifications(n => n.map(x => ({ ...x, read: true })));
    } catch {
      setNotifications(n => n.map(x => ({ ...x, read: true })));
    }
  }

  async function markRead(id: string) {
    try {
      await notificationsApi.markRead(id);
    } catch {}
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }

  const unread = notifications.filter(n => !n.read).length;

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-500">{unread} unread</p>}
        </div>
        {unread > 0 && <Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="mr-2 h-4 w-4" /> Mark all read</Button>}
      </div>

      {fetching ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />)}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = ICON_MAP[n.type] || Bell;
            return (
              <Card key={n.id} className={cn("cursor-pointer transition-all", !n.read && "border-brand-blue bg-blue-50/30")} onClick={() => markRead(n.id)}>
                <CardContent className="flex items-start gap-4 pt-4 pb-4">
                  <div className={cn("mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0", n.read ? "bg-gray-100" : "bg-brand-blue")}>
                    <Icon className={cn("h-4 w-4", n.read ? "text-gray-400" : "text-white")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", !n.read && "text-brand-blue")}>{n.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-brand-blue mt-2 shrink-0" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
