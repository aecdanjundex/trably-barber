import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain → path rewriting.
 *
 * In development:  minha-barbearia.localhost:3000  → /minha-barbearia
 * In production:   minha-barbearia.trably.com      → /minha-barbearia
 *
 * Direct-path access (localhost:3000/minha-barbearia) also works without
 * middleware involvement — Next.js resolves it via the [organization] route.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const rootHostname = new URL(appUrl).hostname; // "localhost" or "trably.com"

  // Strip port for comparison
  const hostWithoutPort = host.split(":")[0];

  if (
    hostWithoutPort !== rootHostname &&
    hostWithoutPort.endsWith(`.${rootHostname}`)
  ) {
    // Never rewrite API or internal Next.js routes — only page paths.
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
      return NextResponse.next();
    }

    const slug = hostWithoutPort.slice(
      0,
      hostWithoutPort.length - rootHostname.length - 1,
    );

    const url = request.nextUrl.clone();
    url.pathname = `/${slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
