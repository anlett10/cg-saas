import { Check, Pencil } from "@tamagui/lucide-icons";
import { useId, useState } from "react";
import { SizableText, Theme, XStack, YStack } from "tamagui";

import { useDeleteTodo, useUpdateTodo } from "@/hooks/use-todo-mutations";
import type { TodoView } from "@/lib/todos";
import { Checkbox, Input, useAlert } from "@/tamagui/bento";
import { Button } from "@/tamagui/components/Button";

export function TodoItem({
    todo,
    disabled = false,
}: {
    todo: TodoView;
    disabled?: boolean;
}) {
    const updateTodo = useUpdateTodo();
    const deleteTodo = useDeleteTodo();
    const { alert } = useAlert("Alert");
    const editFieldId = useId();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(todo.title);

    const busy =
        disabled || updateTodo.isPending || deleteTodo.isPending;

    function confirmDelete() {
        alert({
            title: "Delete this todo?",
            message: `"${todo.title}" will be permanently removed.`,
            buttons: [
                { title: "Cancel", style: "cancel", action: () => {} },
                {
                    title: "Delete",
                    style: "destructive",
                    action: () => deleteTodo.mutate(todo.id),
                },
            ],
        });
    }

    async function saveEditing() {
        const next = draft.trim();
        if (!next || next === todo.title) {
            setEditing(false);
            return;
        }
        await updateTodo.mutateAsync({ id: todo.id, title: next });
        setEditing(false);
    }

    if (editing) {
        return (
            <YStack
                p="$3"
                bg="$color2"
                borderTopWidth={1}
                borderColor="$color5"
                gap="$2"
            >
                <Input size="$5" minW="100%">
                    <Input.Label htmlFor={editFieldId}>Edit todo</Input.Label>
                    <Input.Box height="$5">
                        <Input.Icon>
                            <Pencil />
                        </Input.Icon>
                        <Input.Area
                            id={editFieldId}
                            flex={1}
                            height="100%"
                            pl={0}
                            value={draft}
                            onChangeText={setDraft}
                            autoFocus
                            disabled={busy}
                            onSubmitEditing={() => void saveEditing()}
                        />
                    </Input.Box>
                </Input>
                <XStack gap="$2">
                    <Theme name="blue">
                        <Button
                            flex={1}
                            height="$5"
                            disabled={busy || !draft.trim()}
                            onPress={() => void saveEditing()}
                        >
                            Save
                        </Button>
                    </Theme>
                    <Button
                        variant="outlined"
                        flex={1}
                        height="$5"
                        disabled={busy}
                        onPress={() => {
                            setDraft(todo.title);
                            setEditing(false);
                        }}
                    >
                        Cancel
                    </Button>
                </XStack>
            </YStack>
        );
    }

    return (
        <XStack
            p="$3"
            bg="$color2"
            borderTopWidth={1}
            borderColor="$color5"
            items="center"
            gap="$3"
        >
            <Checkbox
                size="$4"
                checked={todo.completed}
                disabled={busy}
                onCheckedChange={() =>
                    updateTodo.mutate({
                        id: todo.id,
                        completed: !todo.completed,
                    })
                }
            >
                <Checkbox.Indicator>
                    <Check />
                </Checkbox.Indicator>
            </Checkbox>

            <YStack flex={1} gap="$1" minW={0}>
                <SizableText
                    textDecorationLine={
                        todo.completed ? "line-through" : "none"
                    }
                    opacity={todo.completed ? 0.6 : 1}
                    fontWeight="500"
                >
                    {todo.title}
                </SizableText>
                <SizableText size="$2" color="$color10">
                    {new Date(todo.createdAt).toLocaleString()}
                </SizableText>
            </YStack>

            <Button
                size="$2"
                variant="outlined"
                disabled={busy}
                onPress={() => {
                    setDraft(todo.title);
                    setEditing(true);
                }}
            >
                Edit
            </Button>

            <Button
                theme="red"
                px="$3"
                disabled={busy}
                onPress={confirmDelete}
            >
                Delete
            </Button>
        </XStack>
    );
}
