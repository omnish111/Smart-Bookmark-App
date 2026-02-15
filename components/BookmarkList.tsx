"use client";

import { type Bookmark } from "@/types/bookmark";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, loading, onDelete }: BookmarkListProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookmarks yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new bookmark above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
        >
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1" title={bookmark.title}>
              {bookmark.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 break-all line-clamp-2" title={bookmark.url}>
              {bookmark.url}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Visit <ExternalLink className="ml-1 h-4 w-4" />
            </a>
            <button
              onClick={() => onDelete(bookmark.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
              title="Delete bookmark"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
