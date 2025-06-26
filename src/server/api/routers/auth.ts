import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(registerSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const { name, email, password } = input;

                const existingUser = await ctx.db.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'User with this email already exists',
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                const user = await ctx.db.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                });

                return {
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                };
            } catch (error) {

                if (error instanceof TRPCError) {
                    throw error;
                }

                if (error instanceof Error) {
                    if (error.message.includes('Unique constraint')) {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: 'User with this email already exists',
                        });
                    }
                }

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create user',
                    cause: error,
                });
            }
        }),

    getSession: protectedProcedure.query(({ ctx }) => {
        return ctx.session;
    }),
});