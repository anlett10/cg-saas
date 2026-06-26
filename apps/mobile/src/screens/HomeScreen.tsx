import { useCallback, useEffect, useState } from "react";
import { SizableText, Spinner, Theme, YStack } from "tamagui";

import { ScreenHeader } from "../components/ScreenHeader";
import { ScreenLayout } from "../components/ScreenLayout";
import { env } from "../env";
import { api } from "../lib/api";
import { Button } from "../tamagui/components/Button";
import { H3 } from "../tamagui/components/Headings";

type HealthStatus = {
    status: string;
    timestamp: string;
};

export function HomeScreen() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadHealth = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await api.health.get();
            if (result.error || !result.data) {
                setHealth(null);
                setError("Unable to reach API health endpoint");
                return;
            }

            const raw = result.data as { status: string; timestamp: string };
            setHealth({
                status: raw.status,
                timestamp: raw.timestamp,
            });
        } catch {
            setHealth(null);
            setError(`Cannot reach API at ${env.API_URL}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadHealth();
    }, [loadHealth]);

    return (
        <ScreenLayout>
            <ScreenHeader
                title="CG SaaS"
                subtitle="Full-stack todos — web + mobile"
            />

            <YStack gap="$3" flex={1}>
                <SizableText size="$5" color="$color11">
                    Welcome! This mobile app shares the same API and database
                    as the web app. Open the Todos tab to manage items.
                </SizableText>

                <Theme name="blue">
                    <YStack
                        p="$4"
                        bg="$color3"
                        rounded="$4"
                        borderColor="$color6"
                        borderWidth={1}
                        gap="$3"
                    >
                        <H3 size="$5" color="$color11">
                            API Health
                        </H3>

                        {loading ? (
                            <Spinner size="small" color="$color" />
                        ) : error ? (
                            <SizableText color="$red10">{error}</SizableText>
                        ) : health ? (
                            <YStack gap="$2">
                                <XRow label="Status" value={health.status} />
                                <XRow
                                    label="Timestamp"
                                    value={new Date(
                                        health.timestamp,
                                    ).toLocaleString()}
                                />
                            </YStack>
                        ) : null}

                        <Button
                            variant="outlined"
                            onPress={() => void loadHealth()}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                    </YStack>
                </Theme>

                <Theme name="gray">
                    <YStack
                        p="$3"
                        bg="$color2"
                        rounded="$4"
                        borderColor="$color5"
                        borderWidth={1}
                        gap="$1"
                    >
                        <SizableText
                            size="$3"
                            color="$color11"
                            fontWeight="600"
                        >
                            API URL
                        </SizableText>
                        <SizableText size="$2" color="$color10">
                            {env.API_URL}
                        </SizableText>
                    </YStack>
                </Theme>
            </YStack>
        </ScreenLayout>
    );
}

function XRow({ label, value }: { label: string; value: string }) {
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
