import { Link, createFileRoute } from "@tanstack/react-router";
import { SizableText, Spinner, Theme, YStack } from "tamagui";

import { getApiClient } from "@/lib/api";
import { Button } from "@/tamagui/components/Button";
import { GradientBackground } from "@/tamagui/components/GradientBackground";
import { H1, H3 } from "@/tamagui/components/Headings";

type HealthStatus = {
    status: string;
    timestamp: string;
};

export const Route = createFileRoute("/")({
    loader: async (): Promise<{
        health: HealthStatus | null;
        error: string | null;
    }> => {
        const api = getApiClient();
        const { data, error } = await api.health.get();

        if (error || !data) {
            return {
                health: null,
                error: "Unable to reach API health endpoint",
            };
        }

        const raw = data as { status: string; timestamp: string | Date };

        return {
            health: {
                status: raw.status,
                timestamp:
                    raw.timestamp instanceof Date
                        ? raw.timestamp.toISOString()
                        : raw.timestamp,
            },
            error: null,
        };
    },
    component: Home,
});

function Home() {
    const { health, error } = Route.useLoaderData();

    return (
        <GradientBackground>
            <YStack
                maxW={720}
                width="100%"
                mx="auto"
                p="$6"
                gap="$5"
                flex={1}
            >
                <YStack gap="$2">
                    <H1>CG SaaS</H1>
                    <SizableText size="$5" color="$color10">
                        Full-stack todos — web + mobile share one API.
                    </SizableText>
                </YStack>

                <Link to="/todos" style={{ textDecoration: "none" }}>
                    <Button theme="blue">View todos →</Button>
                </Link>

                <Theme name="blue">
                    <YStack
                        p="$4"
                        bg="$color3"
                        rounded="$4"
                        borderWidth={1}
                        borderColor="$color6"
                        gap="$3"
                        maxW={480}
                    >
                        <H3 size="$5" color="$color11">
                            API Health
                        </H3>
                        {error ? (
                            <SizableText color="$red10">{error}</SizableText>
                        ) : health ? (
                            <YStack gap="$2">
                                <Row label="Status" value={health.status} />
                                <Row
                                    label="Timestamp"
                                    value={new Date(
                                        health.timestamp,
                                    ).toLocaleString()}
                                />
                            </YStack>
                        ) : (
                            <Spinner size="small" />
                        )}
                    </YStack>
                </Theme>
            </YStack>
        </GradientBackground>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <YStack gap="$1">
            <SizableText size="$2" color="$color10">
                {label}
            </SizableText>
            <SizableText size="$4" fontWeight="600">
                {value}
            </SizableText>
        </YStack>
    );
}
