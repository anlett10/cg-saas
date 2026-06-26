import { ListPlus } from "@tamagui/lucide-icons";
import { useId, useState } from "react";
import { Theme, XStack, YStack } from "tamagui";

import { useCreateTodo } from "@/hooks/use-todo-mutations";
import { Input } from "@/tamagui/bento";
import { Button } from "@/tamagui/components/Button";

export function CreateTodoForm({ disabled = false }: { disabled?: boolean }) {
    const createTodo = useCreateTodo();
    const fieldId = useId();
    const [title, setTitle] = useState("");
    const trimmed = title.trim();
    const busy = disabled || createTodo.isPending;
    const hasError = Boolean(createTodo.error);

    async function submit() {
        if (!trimmed || busy) return;
        await createTodo.mutateAsync(trimmed);
        setTitle("");
    }

    return (
        <YStack gap="$2">
            <XStack gap="$2" width="100%" items="flex-end">
                <Input
                    flex={1}
                    size="$5"
                    minW={0}
                    {...(hasError ? { theme: "red" } : {})}
                >
                    <Input.Label htmlFor={fieldId}>New todo</Input.Label>
                    <Input.Box height="$5">
                        <Input.Icon>
                            <ListPlus />
                        </Input.Icon>
                        <Input.Area
                            id={fieldId}
                            flex={1}
                            height="100%"
                            pl={0}
                            placeholder="What needs to be done?"
                            value={title}
                            onChangeText={setTitle}
                            disabled={busy}
                            onSubmitEditing={() => void submit()}
                        />
                    </Input.Box>
                    {hasError ? (
                        <Input.Info>{createTodo.error!.message}</Input.Info>
                    ) : null}
                </Input>
                <Theme name="blue">
                    <Button
                        px="$4"
                        height="$5"
                        disabled={busy || !trimmed}
                        onPress={() => void submit()}
                    >
                        {createTodo.isPending ? "Adding…" : "Add"}
                    </Button>
                </Theme>
            </XStack>
        </YStack>
    );
}
