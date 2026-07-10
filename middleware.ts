import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectStudio = process.env.NEXT_PUBLIC_SANITY_STUDIO_PROTECT === "true";

  if (!protectStudio || !request.nextUrl.pathname.startsWith("/studio")) {
    return NextResponse.next();
  }

  const hasSanitySession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.toLowerCase().includes("sanity"));

  if (hasSanitySession) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/studio/:path*"]
};
