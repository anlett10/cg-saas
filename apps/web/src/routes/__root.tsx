import {
    createRootRouteWithContext,
    type ErrorComponentProps,
    HeadContent,
    Link,
    Scripts,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { SizableText, YStack } from "tamagui";

import { TamaguiAppProvider } from "@/tamagui/TamaguiAppProvider";
import { Button } from "@/tamagui/components/Button";
import { GradientBackground } from "@/tamagui/components/GradientBackground";
import { H1 } from "@/tamagui/components/Headings";

import appCss from "../styles.css?url";
import tamaguiCss from "../tamagui/tamagui.generated.css?url";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "CG SaaS",
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
            {
                rel: "stylesheet",
                href: tamaguiCss,
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            },
        ],
    }),
    notFoundComponent: NotFound,
    errorComponent: RouteError,
    shellComponent: RootDocument,
});

function RouteError({ error, reset }: ErrorComponentProps) {
    const router = useRouter();

    return (
        <GradientBackground>
            <YStack maxW={640} mx="auto" p="$6" gap="$4">
                <H1 size="$8">Something went wrong</H1>
                <SizableText color="$color10">
                    An unexpected error occurred while loading this page.
                </SizableText>
                {error?.message ? (
                    <SizableText
                        fontFamily="$mono"
                        size="$2"
                        bg="$color2"
                        p="$3"
                        rounded="$3"
                    >
                        {error.message}
                    </SizableText>
                ) : null}
                <YStack gap="$2">
                    <Button
                        onPress={() => {
                            reset();
                            void router.invalidate();
                        }}
                    >
                        Try again
                    </Button>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Button variant="outlined">← Back to home</Button>
                    </Link>
                </YStack>
            </YStack>
        </GradientBackground>
    );
}

function NotFound() {
    return (
        <GradientBackground>
            <YStack maxW={640} mx="auto" p="$6" gap="$3">
                <H1 size="$8">Page not found</H1>
                <SizableText color="$color10">
                    The page you are looking for does not exist.
                </SizableText>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Button variant="outlined">← Back to home</Button>
                </Link>
            </YStack>
        </GradientBackground>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <TamaguiAppProvider>{children}</TamaguiAppProvider>
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
