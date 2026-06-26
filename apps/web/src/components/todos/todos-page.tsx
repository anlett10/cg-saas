import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SizableText, Spinner, Theme, XStack, YStack } from "tamagui";

import { CreateTodoForm } from "@/components/todos/create-todo-form";
import { TodoItem } from "@/components/todos/todo-item";
import {
    TodosToolbar,
    type TodoFilter,
} from "@/components/todos/todos-toolbar";
import { useTodos } from "@/hooks/use-todos";
import type { TodoView } from "@/lib/todos";
import { Alert } from "@/tamagui/bento";
import { Button } from "@/tamagui/components/Button";
import { GradientBackground } from "@/tamagui/components/GradientBackground";
import { H1, H3 } from "@/tamagui/components/Headings";

function filterTodos(
    todos: TodoView[],
    filter: TodoFilter,
    search: string,
) {
    const query = search.trim().toLowerCase();

    return todos.filter((todo) => {
        if (filter === "active" && todo.completed) return false;
        if (filter === "completed" && !todo.completed) return false;
        if (query && !todo.title.toLowerCase().includes(query)) return false;
        return true;
    });
}

export function TodosPage() {
    const [filter, setFilter] = useState<TodoFilter>("all");
    const [search, setSearch] = useState("");

    const {
        data: todos = [],
        isLoading,
        error,
        refetch,
        isFetching,
    } = useTodos();

    const visibleTodos = useMemo(
        () => filterTodos(todos, filter, search),
        [todos, filter, search],
    );

    const completed = todos.filter((todo) => todo.completed).length;
    const hasFilters = filter !== "all" || search.trim().length > 0;

    return (
        <GradientBackground>
            <Alert>
                <YStack
                maxW={720}
                width="100%"
                mx="auto"
                p="$6"
                gap="$4"
                flex={1}
            >
                <XStack items="center" justify="space-between" gap="$3">
                    <YStack gap="$1">
                        <H1 size="$9">Todos</H1>
                        {todos.length > 0 ? (
                            <SizableText color="$color10">
                                {completed}/{todos.length} completed
                                {hasFilters
                                    ? ` · ${visibleTodos.length} shown`
                                    : null}
                            </SizableText>
                        ) : null}
                    </YStack>
                    <XStack gap="$2" items="center">
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button variant="outlined">← Home</Button>
                        </Link>
                    </XStack>
                </XStack>

                <YStack
                    gap="$4"
                    bg="$color2"
                    borderWidth={1}
                    borderColor="$color5"
                    rounded="$4"
                    p="$4"
                    width="100%"
                    $sm={{ p: "$6" }}
                >
                    <CreateTodoForm disabled={isLoading} />
                    <TodosToolbar
                        filter={filter}
                        onFilterChange={setFilter}
                        search={search}
                        onSearchChange={setSearch}
                        disabled={isLoading}
                    />
                </YStack>

                <XStack justify="flex-end">
                    <Button
                        variant="outlined"
                        onPress={() => void refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Refreshing…" : "Refresh"}
                    </Button>
                </XStack>

                {isLoading ? (
                    <YStack p="$4" items="center">
                        <Spinner size="small" />
                    </YStack>
                ) : null}

                {error ? (
                    <Theme name="red">
                        <SizableText color="$color10">{error.message}</SizableText>
                    </Theme>
                ) : null}

                {!isLoading && !error && todos.length === 0 ? (
                    <YStack
                        p="$4"
                        bg="$color2"
                        rounded="$4"
                        borderWidth={1}
                        borderColor="$color5"
                    >
                        <H3 size="$5" color="$color10">
                            No todos yet — add one above!
                        </H3>
                    </YStack>
                ) : null}

                {!isLoading && !error && todos.length > 0 && visibleTodos.length === 0 ? (
                    <YStack
                        p="$4"
                        bg="$color2"
                        rounded="$4"
                        borderWidth={1}
                        borderColor="$color5"
                    >
                        <H3 size="$5" color="$color10">
                            No todos match your filters.
                        </H3>
                    </YStack>
                ) : null}

                {visibleTodos.length > 0 ? (
                    <YStack
                        rounded="$4"
                        borderWidth={1}
                        borderColor="$color5"
                        overflow="hidden"
                    >
                        {visibleTodos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </YStack>
                ) : null}
            </YStack>
            </Alert>
        </GradientBackground>
    );
}
