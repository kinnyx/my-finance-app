import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials.email || !credentials?.password) return null;

                // หา User ใน DB
                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) return null;

                // เช็ครหัสผ่าน
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (isPasswordCorrect) return user;

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub; // sub คือ ID ของ User จาก Database
            }
            return session;
        }
    }
})