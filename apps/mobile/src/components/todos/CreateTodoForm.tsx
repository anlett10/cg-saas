import { useState } from "react";
import { XStack } from "tamagui";

import { Button } from "../../tamagui/components/Button";
import { Input } from "../../tamagui/components/Input";

export function CreateTodoForm({
    onCreate,
    disabled,
}: {
    onCreate: (title: string) => Promise<void>;
    disabled?: boolean;
}) {
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function submit() {
        const next = title.trim();
        if (!next || submitting || disabled) return;

        setSubmitting(true);
        try {
            await onCreate(next);
            setTitle("");
        } catch {
            // parent sets error
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <XStack gap="$2" width="100%" items="center">
            <Input
                flex={1}
                placeholder="What needs to be done?"
                value={title}
                onChangeText={setTitle}
                disabled={disabled || submitting}
                onSubmitEditing={() => void submit()}
                returnKeyType="done"
                size="$5"
                height={50}
            />
            <Button
                theme="blue"
                px="$4"
                disabled={disabled || submitting || !title.trim()}
                onPress={() => void submit()}
            >
                {submitting ? "…" : "Add"}
            </Button>
        </XStack>
    );
}
