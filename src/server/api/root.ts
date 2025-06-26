import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { authRouter } from '@/server/api/routers/auth';
import { secretsRouter } from '@/server/api/routers/secrets';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    secrets: secretsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);