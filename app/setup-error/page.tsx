"use client";

import { AlertTriangle } from "lucide-react";

export default function SetupErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl border border-red-100">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Required
          </h1>
          <p className="text-gray-600 mb-6">
            The application is missing valid Supabase credentials.
          </p>
          
          <div className="w-full text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Action Required:
            </h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Open <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code> in your project root.</li>
              <li>Replace the placeholder values with your actual Supabase keys.</li>
              <li>Restart the development server.</li>
            </ol>
          </div>

          <div className="text-xs text-gray-500">
            Check <code>DEPLOYMENT.md</code> for full setup instructions.
          </div>
        </div>
      </div>
    </div>
  );
}
