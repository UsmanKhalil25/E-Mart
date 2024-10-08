import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export default async function middlware(req: NextRequest) {
  return withAuth(req);
}

export const config = {
  matcher: [
    "/sale/:path*",
    "/customer/:path*",
    "/product/:path*",
    "/dashboard",
  ],
};
