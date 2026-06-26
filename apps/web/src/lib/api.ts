import type { App } from "@cg-saas/api";
import { treaty } from "@elysia/eden";
import { createIsomorphicFn } from "@tanstack/react-start";

import { env } from "../env";

/**
 * Eden client — talks to the standalone API server (`VITE_API_URL`).
 *
 * Routes under `/api/todos` are accessed as `api.api.todos.*` (Eden mirrors
 * the URL path). Health lives at `/health` → `api.health.get()`.
 *
 * `parseDate: false` keeps timestamp fields as ISO strings for TypeBox validation.
 */
export const getApiClient = createIsomorphicFn()
    .server(() =>
        treaty<App>(env.VITE_API_URL, {
            parseDate: false,
        }),
    )
    .client(() =>
        treaty<App>(env.VITE_API_URL, {
            parseDate: false,
        }),
    );

export type ApiClient = ReturnType<typeof getApiClient>;
