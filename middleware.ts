import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Update session Supabase
  const response = await updateSession(request);
  
  // Tambahkan logika untuk melindungi rute dashboard
  const requestUrl = new URL(request.url);
  const isDashboardRoute = requestUrl.pathname.startsWith('/dashboard');
  
  // Ambil informasi session dari response cookies
  const supabaseSessionCookie = response.cookies.get('sb-session');
  const hasActiveSession = !!supabaseSessionCookie?.value;
  
  // Jika tidak ada session dan mencoba akses dashboard, redirect ke sign-in
  if (!hasActiveSession && isDashboardRoute) {
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.searchParams.set('redirectedFrom', requestUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Jika ada session dan mengakses halaman auth, redirect ke dashboard
  if (hasActiveSession && (
    requestUrl.pathname.startsWith('/sign-in') ||
    requestUrl.pathname.startsWith('/sign-up') ||
    requestUrl.pathname.startsWith('/forgot-password')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};