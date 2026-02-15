import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Check for missing or invalid Supabase credentials
  if (!supabaseUrl || !supabaseUrl.startsWith("http") || supabaseUrl === "your-project-url") {
    // If not already on the error page, redirect to it
    if (!request.nextUrl.pathname.startsWith("/setup-error")) {
      return NextResponse.redirect(new URL("/setup-error", request.url));
    }
    return NextResponse.next();
  }
  
  // If we are on the error page but config is fixed, redirect to home
  if (request.nextUrl.pathname.startsWith("/setup-error")) {
     return NextResponse.redirect(new URL("/", request.url));
  }
  
  try {
    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
                request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            );
            },
        },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login if accessing protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Redirect unauthenticated users on root to login
    if (request.nextUrl.pathname === "/" && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users from login or root to dashboard
    if ((request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname === "/") && user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  } catch (e) {
      // If validation fails inside createServerClient despite checks
      return NextResponse.redirect(new URL("/setup-error", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
