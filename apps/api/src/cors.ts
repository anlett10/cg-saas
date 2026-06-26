import { Elysia } from "elysia";

import { env } from "./env";

function applyCors(set: { headers: Record<string, string | number> }, request: Request) {
    const origin = request.headers.get("origin");
    const allowOrigin =
        env.NODE_ENV === "development"
            ? (origin ?? env.CORS_ORIGIN)
            : env.CORS_ORIGIN;

    set.headers["access-control-allow-origin"] = allowOrigin;
    set.headers["access-control-allow-credentials"] = "true";
    set.headers["access-control-allow-methods"] =
        "GET, POST, PUT, PATCH, DELETE, OPTIONS";
    set.headers["access-control-allow-headers"] = "Content-Type, Authorization";
}

/** Manual CORS — `@elysiajs/cors` is not compatible with Elysia v2 yet. */
export const cors = new Elysia({ name: "cors" })
    .beforeHandle("global", ({ request, set }) => {
        applyCors(set, request);
    })
    .options("*", ({ set, request }) => {
        applyCors(set, request);
        set.status = 204;
        return "";
    });
