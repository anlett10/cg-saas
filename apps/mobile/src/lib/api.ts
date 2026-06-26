import type { App } from "@cg-saas/api";
import { treaty } from "@elysia/eden";

import { env } from "../env";

/**
 * Eden Treaty client for the standalone API (`EXPO_PUBLIC_API_URL`).
 *
 * Same pattern as web — routes under `/api/todos` → `api.api.todos.*`.
 * `parseDate: false` keeps timestamps as ISO strings for TypeBox validation.
 */
let cachedUrl: string | undefined;
let cachedClient: ReturnType<typeof treaty<App>> | undefined;

function getApiClient() {
    const url = env.API_URL;
    if (!cachedClient || cachedUrl !== url) {
        cachedUrl = url;
        cachedClient = treaty<App>(url, { parseDate: false });
    }
    return cachedClient;
}

export const api = new Proxy({} as ReturnType<typeof treaty<App>>, {
    get(_target, prop, receiver) {
        return Reflect.get(getApiClient() as object, prop, receiver);
    },
});

export type ApiClient = ReturnType<typeof treaty<App>>;
