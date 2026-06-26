import { Search } from "@tamagui/lucide-icons";
import { useId } from "react";
import { Separator, SizableText, Theme, XStack, YStack } from "tamagui";

import { Chip, Input, Switch } from "@/tamagui/bento";

export type TodoFilter = "all" | "active" | "completed";

const FILTER_OPTIONS: { value: TodoFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Done" },
];

export function TodosToolbar({
    filter,
    onFilterChange,
    search,
    onSearchChange,
    disabled = false,
}: {
    filter: TodoFilter;
    onFilterChange: (filter: TodoFilter) => void;
    search: string;
    onSearchChange: (search: string) => void;
    disabled?: boolean;
}) {
    const searchId = useId();

    return (
        <YStack gap="$3">
            <Separator borderColor="$color5" />

            <Input size="$5" minW="100%">
                <Input.Label htmlFor={searchId}>Search</Input.Label>
                <Input.Box height="$5">
                    <Input.Icon>
                        <Search />
                    </Input.Icon>
                    <Input.Area
                        id={searchId}
                        flex={1}
                        height="100%"
                        pl={0}
                        placeholder="Filter by title…"
                        value={search}
                        onChangeText={onSearchChange}
                        disabled={disabled}
                    />
                </Input.Box>
            </Input>

            <YStack gap="$2">
                <XStack items="center" justify="space-between" gap="$3">
                    <SizableText size="$3" fontWeight="600" color="$color11">
                        Show
                    </SizableText>
                    <XStack items="center" gap="$2">
                        <SizableText size="$2" color="$color10">
                            Include completed
                        </SizableText>
                        <Switch
                            size="$2"
                            checked={filter !== "active"}
                            disabled={disabled}
                            onCheckedChange={(checked) => {
                                onFilterChange(checked ? "all" : "active");
                            }}
                        >
                            <Switch.Thumb transition="quick" />
                        </Switch>
                    </XStack>
                </XStack>
                <XStack gap="$2" flexWrap="wrap">
                    {FILTER_OPTIONS.map(({ value, label }) => {
                        const selected = filter === value;

                        if (selected) {
                            return (
                                <Theme key={value} name="blue">
                                    <Chip
                                        size="$4"
                                        pressable
                                        onPress={() => onFilterChange(value)}
                                        disabled={disabled}
                                    >
                                        <Chip.Text fontWeight="600">
                                            {label}
                                        </Chip.Text>
                                    </Chip>
                                </Theme>
                            );
                        }

                        return (
                            <Chip
                                key={value}
                                size="$4"
                                pressable
                                onPress={() => onFilterChange(value)}
                                disabled={disabled}
                                bg="$color3"
                                borderWidth={1}
                                borderColor="$color6"
                                hoverStyle={{ bg: "$color4" }}
                                pressStyle={{ bg: "$color5" }}
                            >
                                <Chip.Text color="$color11">{label}</Chip.Text>
                            </Chip>
                        );
                    })}
                </XStack>
            </YStack>
        </YStack>
    );
}
