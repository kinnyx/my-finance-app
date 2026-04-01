import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

// กำหนดว่าให้ Middleware นี้ทำงานกับเส้นทางไหนบ้าง
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};