import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface CreateContextOptions {
    headers: Headers;
}

export const createTRPCContext = async (opts: CreateContextOptions) => {
    const session = await auth();

    return {
        db,
        session,
        headers: opts.headers,
    };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});