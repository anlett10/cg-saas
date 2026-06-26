import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3001;

function isLoopbackUrl(url: string): boolean {
    try {
        const { hostname } = new URL(url);
        return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
        return false;
    }
}

function isPrivateLanHost(hostname: string): boolean {
    return (
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
}

/** Metro host (e.g. `192.168.1.73:8081`) — same machine as the API in dev. */
function hostFromExpoDevServer(): string | undefined {
    const debuggerHost =
        Constants.expoGoConfig?.debuggerHost ?? Constants.expoConfig?.hostUri;

    if (!debuggerHost) return undefined;
    return debuggerHost.split(":")[0];
}

function resolveApiUrl(): string {
    const configured = process.env.EXPO_PUBLIC_API_URL;
    const devHost = hostFromExpoDevServer();

    // Physical device / Expo Go: Metro IP is your Mac — API uses the same host, port 3001
    if (devHost) {
        if (!configured || isLoopbackUrl(configured)) {
            return `http://${devHost}:${API_PORT}`;
        }

        try {
            const configuredHost = new URL(configured).hostname;
            // Stale `.env` LAN IP after router reassignment — follow current Metro host
            if (
                isPrivateLanHost(configuredHost) &&
                configuredHost !== devHost
            ) {
                return `http://${devHost}:${API_PORT}`;
            }
        } catch {
            // ignore invalid EXPO_PUBLIC_API_URL
        }
    }

    if (configured) return configured;

    if (Platform.OS === "android") {
        return `http://10.0.2.2:${API_PORT}`;
    }

    return `http://localhost:${API_PORT}`;
}

export const env = {
    /** Re-resolved each read so a new Metro IP applies after reload. */
    get API_URL() {
        return resolveApiUrl();
    },
} as const;
