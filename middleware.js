import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const referer = req.headers.get("referer");
  if (referer?.includes("facebook")) {
    const redirectUrl = `https://hayerov.org/${url.pathname}`;
    return NextResponse.redirect(redirectUrl);
  }
}
