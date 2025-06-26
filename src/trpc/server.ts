import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { createCaller, type AppRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { createQueryClient } from './query-client';

const createContext = cache(async () => {
    const heads = await headers();
    const headerEntries = Array.from(heads.entries());
    const headersObject = Object.fromEntries(headerEntries);

    return createTRPCContext({
        headers: new Headers({
            ...headersObject,
            'x-trpc-source': 'rsc',
        }),
    });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
    caller,
    getQueryClient,
);