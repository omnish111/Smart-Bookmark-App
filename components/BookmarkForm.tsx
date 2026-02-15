"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookmarkForm({ onAdd }: { onAdd: (bookmark: any) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic URL validation
      let validUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        validUrl = `https://${url}`;
      }
      try {
        new URL(validUrl);
      } catch {
        throw new Error("Invalid URL format");
      }

      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to add bookmarks");
      }

      const { data, error: dbError } = await supabase
        .from("bookmarks")
        .insert({
          title,
          url: validUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
          onAdd(data);
      }

      setTitle("");
      setUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to add bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Bookmark</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Review Website"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-50 border text-gray-900"
          />
        </div>
        <div className="flex-[2]">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            type="text"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-gray-50 border text-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:mt-0 sm:w-auto",
            loading && "opacity-75 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add
        </button>
      </form>
      {error && (
        <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
