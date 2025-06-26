import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyPassword } from '@/lib/password';
import { db } from '@/lib/db';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await db.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await verifyPassword(password, user.password);

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                        };
                    }
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;