import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { encryptSecret, decryptSecret } from '@/lib/encryption';

export const secretsRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                content: z.string().min(1).max(10000),
                isOneTime: z.boolean().default(false),
                expiresAt: z.date().optional(),
                password: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { content, isOneTime, expiresAt, password } = input;

            const encryptedContent = encryptSecret(content);

            const passwordHash = password ? await bcrypt.hash(password, 12) : null;

            const secret = await ctx.db.secret.create({
                data: {
                    content: encryptedContent,
                    isOneTime,
                    isPassword: !!password,
                    passwordHash,
                    expiresAt,
                    userId: ctx.session?.user?.id,
                },
                select: {
                    id: true,
                },
            });

            return { id: secret.id };
        }),

    get: publicProcedure
        .input(
            z.object({
                id: z.string(),
                password: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { id, password } = input;

            const secret = await ctx.db.secret.findUnique({
                where: { id },
            });

            if (!secret) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Secret not found',
                });
            }

            if (secret.expiresAt && secret.expiresAt < new Date()) {
                await ctx.db.secret.delete({ where: { id } });
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Secret has expired and been deleted',
                });
            }

            if (secret.isOneTime && secret.isViewed) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Secret has already been viewed and destroyed',
                });
            }

            if (secret.isPassword && secret.passwordHash) {
                if (!password) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Password required',
                    });
                }

                const isValidPassword = await bcrypt.compare(password, secret.passwordHash);
                if (!isValidPassword) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'Invalid password',
                    });
                }
            }

            const decryptedContent = decryptSecret(secret.content);

            if (secret.isOneTime) {
                await ctx.db.secret.update({
                    where: { id },
                    data: { isViewed: true },
                });
            }

            return {
                content: decryptedContent,
                isOneTime: secret.isOneTime,
                expiresAt: secret.expiresAt,
            };
        }),

    list: protectedProcedure.query(async ({ ctx }) => {
        const secrets = await ctx.db.secret.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            select: {
                id: true,
                isOneTime: true,
                isViewed: true,
                isPassword: true,
                expiresAt: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return secrets.map((secret: any) => ({
            ...secret,
            status:
                secret.isOneTime && secret.isViewed
                    ? 'viewed'
                    : secret.expiresAt && secret.expiresAt < new Date()
                        ? 'expired'
                        : 'active',
        }));
    }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { id } = input;

            const secret = await ctx.db.secret.findFirst({
                where: {
                    id,
                    userId: ctx.session.user.id,
                },
            });

            if (!secret) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Secret not found',
                });
            }

            await ctx.db.secret.delete({
                where: { id },
            });

            return { success: true };
        }),
});