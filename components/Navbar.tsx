"use client";

import { createClient } from "@/lib/supabaseClient";
import { type User } from "@supabase/supabase-js";
import { LogOut, Bookmark, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    router.push("/login"); 
    router.refresh();
  };

  return (
    <>
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Bookmark className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                  Bookmarks
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.user_metadata.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.full_name || "User"}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] lg:max-w-[200px] truncate">
                      {user.user_metadata.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-gray-900/5 transition-all">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Sign out
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to sign out? You will need to log in again to access your bookmarks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              <button
                type="button"
                onClick={confirmLogout}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="mt-2 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
