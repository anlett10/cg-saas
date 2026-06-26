import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createTodo,
    deleteTodo,
    todoKeys,
    updateTodo,
} from "@/lib/todos";

export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (title: string) => createTodo(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
    });
}

export function useUpdateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            ...input
        }: {
            id: number;
            title?: string;
            completed?: boolean;
        }) => updateTodo(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
    });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTodo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
    });
}
