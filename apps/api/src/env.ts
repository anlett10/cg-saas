const port = Number(process.env.PORT ?? 3001);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const host = process.env.HOST ?? "0.0.0.0";

export const env = {
    PORT: Number.isFinite(port) ? port : 3001,
    HOST: host,
    CORS_ORIGIN: corsOrigin,
    NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
