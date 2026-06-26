import { createFileRoute } from "@tanstack/react-router";
import { Spinner, YStack } from "tamagui";

import { TodosPage } from "@/components/todos/todos-page";
import { todosQueryOptions } from "@/hooks/use-todos";
import { GradientBackground } from "@/tamagui/components/GradientBackground";

function TodosPending() {
    return (
        <GradientBackground>
            <YStack p="$6" items="center" justify="center" flex={1}>
                <Spinner size="small" />
            </YStack>
        </GradientBackground>
    );
}

export const Route = createFileRoute("/todos")({
    ssr: "data-only",
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(todosQueryOptions),
    pendingComponent: TodosPending,
    component: TodosPage,
});
