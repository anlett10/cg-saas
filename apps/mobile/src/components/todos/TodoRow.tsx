import { useState } from "react";
import { Alert } from "react-native";
import { SizableText, XStack, YStack } from "tamagui";

import type { TodoView } from "@cg-saas/todos";

import { Button } from "../../tamagui/components/Button";
import { Input } from "../../tamagui/components/Input";

export function TodoRow({
    todo,
    busy,
    onToggle,
    onUpdate,
    onDelete,
}: {
    todo: TodoView;
    busy?: boolean;
    onToggle: () => void;
    onUpdate: (title: string) => Promise<void>;
    onDelete: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(todo.title);
    const [saving, setSaving] = useState(false);

    function startEditing() {
        setDraft(todo.title);
        setEditing(true);
    }

    function cancelEditing() {
        setDraft(todo.title);
        setEditing(false);
    }

    async function saveEditing() {
        const next = draft.trim();
        if (!next) return;

        if (next === todo.title) {
            setEditing(false);
            return;
        }

        setSaving(true);
        try {
            await onUpdate(next);
            setEditing(false);
        } catch {
            // parent sets error
        } finally {
            setSaving(false);
        }
    }

    function confirmDelete() {
        Alert.alert(
            "Delete this todo?",
            `"${todo.title}" will be permanently removed.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: onDelete,
                },
            ],
        );
    }

    if (editing) {
        return (
            <YStack
                p="$3"
                bg="$color2"
                rounded="$4"
                borderColor="$color6"
                borderWidth={1}
                gap="$2"
            >
                <Input
                    value={draft}
                    onChangeText={setDraft}
                    autoFocus
                    disabled={busy || saving}
                    onSubmitEditing={() => void saveEditing()}
                />
                <XStack gap="$2">
                    <Button
                        theme="blue"
                        flex={1}
                        disabled={busy || saving || !draft.trim()}
                        onPress={() => void saveEditing()}
                    >
                        {saving ? "Saving…" : "Save"}
                    </Button>
                    <Button
                        variant="outlined"
                        flex={1}
                        disabled={busy || saving}
                        onPress={cancelEditing}
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
            rounded="$4"
            borderColor="$color5"
            borderWidth={1}
            items="center"
            gap="$3"
            opacity={busy ? 0.7 : 1}
        >
            <XStack
                width={22}
                height={22}
                rounded="$2"
                borderWidth={2}
                borderColor={todo.completed ? "$green9" : "$color8"}
                bg={todo.completed ? "$green9" : "transparent"}
                items="center"
                justify="center"
                onPress={busy ? undefined : onToggle}
                pressStyle={{ opacity: 0.8 }}
            >
                {todo.completed ? (
                    <SizableText size="$1" color="white" fontWeight="700">
                        ✓
                    </SizableText>
                ) : null}
            </XStack>

            <YStack flex={1} gap="$1">
                <SizableText
                    textDecorationLine={
                        todo.completed ? "line-through" : "none"
                    }
                    opacity={todo.completed ? 0.6 : 1}
                    fontWeight="500"
                >
                    {todo.title}
                </SizableText>
                <SizableText size="$1" color="$color10">
                    {new Date(todo.createdAt).toLocaleString()}
                </SizableText>
            </YStack>

            <Button
                size="$2"
                variant="outlined"
                disabled={busy}
                onPress={startEditing}
            >
                Edit
            </Button>

            <Button
                theme="red"
                px="$3"
                disabled={busy}
                onPress={confirmDelete}
            >
                ✕
            </Button>
        </XStack>
    );
}
