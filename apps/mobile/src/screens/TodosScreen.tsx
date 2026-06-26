import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SizableText, Spinner, Theme, XStack, YStack } from "tamagui";

import type { TodoView } from "@cg-saas/todos";

import { ScreenHeader } from "../components/ScreenHeader";
import { ScreenLayout } from "../components/ScreenLayout";
import { CreateTodoForm } from "../components/todos/CreateTodoForm";
import { TodoRow } from "../components/todos/TodoRow";
import {
    createTodo,
    deleteTodo,
    getTodos,
    TodoApiError,
    updateTodo,
} from "../lib/todos";
import { H3 } from "../tamagui/components/Headings";
import { Button } from "../tamagui/components/Button";

function errorMessage(err: unknown, fallback: string): string {
    if (err instanceof TodoApiError) return err.message;
    if (err instanceof Error) return err.message;
    return fallback;
}

export function TodosScreen() {
    const [todos, setTodos] = useState<TodoView[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const loadTodos = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError(null);

        try {
            const rows = await getTodos();
            setTodos(rows);
        } catch (err) {
            setError(errorMessage(err, "Failed to load todos"));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadTodos();
    }, [loadTodos]);

    const handleCreate = useCallback(async (title: string) => {
        setError(null);
        try {
            const todo = await createTodo(title);
            setTodos((prev) => [...prev, todo]);
        } catch (err) {
            setError(errorMessage(err, "Failed to create todo"));
            throw err;
        }
    }, []);

    const handleToggle = useCallback(async (todo: TodoView) => {
        setBusyId(todo.id);
        setError(null);
        try {
            const updated = await updateTodo(todo.id, {
                completed: !todo.completed,
            });
            setTodos((prev) =>
                prev.map((row) => (row.id === updated.id ? updated : row)),
            );
        } catch (err) {
            setError(errorMessage(err, "Failed to update todo"));
        } finally {
            setBusyId(null);
        }
    }, []);

    const handleUpdate = useCallback(async (id: number, title: string) => {
        setBusyId(id);
        setError(null);
        try {
            const updated = await updateTodo(id, { title });
            setTodos((prev) =>
                prev.map((row) => (row.id === updated.id ? updated : row)),
            );
        } catch (err) {
            setError(errorMessage(err, "Failed to update todo"));
            throw err;
        } finally {
            setBusyId(null);
        }
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        setBusyId(id);
        setError(null);
        try {
            await deleteTodo(id);
            setTodos((prev) => prev.filter((row) => row.id !== id));
        } catch (err) {
            setError(errorMessage(err, "Failed to delete todo"));
        } finally {
            setBusyId(null);
        }
    }, []);

    const completed = todos.filter((todo) => todo.completed).length;

    return (
        <ScreenLayout>
            <ScreenHeader
                title="Todos"
                subtitle={
                    todos.length > 0
                        ? `${completed}/${todos.length} completed`
                        : "Manage your tasks"
                }
            />

            <CreateTodoForm onCreate={handleCreate} disabled={loading} />

            <XStack justify="flex-end">
                <Button
                    variant="outlined"
                    onPress={() => void loadTodos(true)}
                    disabled={loading || refreshing}
                >
                    {refreshing ? "Refreshing…" : "Refresh"}
                </Button>
            </XStack>

            {loading ? (
                <YStack p="$4" items="center" justify="center">
                    <Spinner size="small" color="$color" />
                </YStack>
            ) : null}

            {error ? (
                <Theme name="red">
                    <SizableText color="$color10">{error}</SizableText>
                </Theme>
            ) : null}

            {!loading && !error && todos.length === 0 ? (
                <YStack p="$4" items="center" justify="center" mt="$2">
                    <H3 size="$5" color="$color10">
                        No todos yet — add one above!
                    </H3>
                </YStack>
            ) : null}

            <FlatList
                data={todos}
                keyExtractor={(item) => String(item.id)}
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadTodos(true)}
                    />
                }
                contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <TodoRow
                        todo={item}
                        busy={busyId === item.id}
                        onToggle={() => handleToggle(item)}
                        onUpdate={(title) => handleUpdate(item.id, title)}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
            />
        </ScreenLayout>
    );
}
