"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { type Bookmark } from "@/types/bookmark";

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        setBookmarks((data as Bookmark[]) || []);
      }
      setLoading(false);
    };

    fetchBookmarks();

    // Realtime Subscription
    const channel = supabase
      .channel("realtime_bookmarks")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            // Prevent duplicate if we already added it optimistically
            if (prev.some((b) => b.id === newBookmark.id)) {
              return prev;
            }
            return [newBookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAdd = (newBookmark: Bookmark) => {
    // Immediate update
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleDelete = async (id: string) => {
    // Immediate/Optimistic update
    const previousBookmarks = [...bookmarks];
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    
    if (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark");
      // Revert on error
      setBookmarks(previousBookmarks);
    }
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            My Bookmarks
          </h2>
        </div>
      </div>

      <BookmarkForm onAdd={handleAdd} />
      <div className="mt-8">
        <BookmarkList bookmarks={bookmarks} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}
