import { queryOptions, useQuery } from "@tanstack/react-query";

import { getTodos, todoKeys } from "@/lib/todos";

export const todosQueryOptions = queryOptions({
    queryKey: todoKeys.all,
    queryFn: getTodos,
});

export function useTodos() {
    return useQuery(todosQueryOptions);
}
