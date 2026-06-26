import { Elysia, t } from "elysia";

import { cors } from "./cors";
import { env } from "./env";
import { todosRoutes } from "./routes/todos";

const app = new Elysia()
    .request(({ request }) => {
        console.info(`[REQ] ${request.method} ${request.url}`);
    })
    .use(cors)
    .use(todosRoutes)
    .get("/", () => ({
        name: "CG SaaS API",
        version: "1.0.0",
        status: "running",
        health: "/health",
        timestamp: new Date().toISOString(),
    }))
    .get(
        "/health",
        {
            response: {
                200: t.Object({
                    status: t.String(),
                    timestamp: t.String(),
                }),
            },
        },
        () => ({
            status: "ok",
            timestamp: new Date().toISOString(),
        }),
    )
    .listen({ port: env.PORT, hostname: env.HOST }, ({ hostname, port }) => {
        console.info(`API server running at http://${hostname}:${port}`);
        console.info(
            "LAN devices: use your Mac IP, e.g. http://192.168.x.x:3001/health",
        );
    });

if (!app.server) {
    console.error("Failed to start API server");
    process.exit(1);
}

export type App = typeof app;
