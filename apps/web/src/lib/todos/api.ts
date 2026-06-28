import { getApiClient } from "@/lib/api";
import { parseTodo, type TodoView } from "@cg-saas/todos";

/** Error thrown when a todos API call fails, preserving the HTTP status and server message. */
export class TodoApiError extends Error {
    readonly status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "TodoApiError";
        this.status = status;
    }
}

function extractMessage(value: unknown): string | undefined {
    if (value && typeof value === "object" && "error" in value) {
        const message = (value as { error: unknown }).error;
        if (typeof message === "string" && message.length > 0) {
            return message;
        }
    }

    if (typeof value === "string" && value.length > 0) {
        return value;
    }

    return undefined;
}

function fail(error: { status: unknown; value: unknown }, fallback: string): never {
    const status = typeof error.status === "number" ? error.status : undefined;
    throw new TodoApiError(extractMessage(error.value) ?? fallback, status);
}

export async function getTodos(): Promise<TodoView[]> {
    const app = getApiClient();
    const result = await app.api.todos.get();
    if (result.error) fail(result.error, "Failed to load todos");

    const rows = Array.isArray(result.data) ? result.data : [result.data];
    return rows.map(parseTodo);
}

export async function createTodo(title: string): Promise<TodoView> {
    const app = getApiClient();
    const result = await app.api.todos.post({ title });
    if (result.error) fail(result.error, "Failed to create todo");

    return parseTodo(result.data);
}

export async function updateTodo(
    id: number,
    input: { title?: string; completed?: boolean },
): Promise<TodoView> {
    const app = getApiClient();
    const result = await app.api.todos({ id }).patch(input);
    if (result.error) fail(result.error, "Failed to update todo");

    return parseTodo(result.data);
}

export async function deleteTodo(id: number): Promise<TodoView> {
    const app = getApiClient();
    const result = await app.api.todos({ id }).delete();
    if (result.error) fail(result.error, "Failed to delete todo");

    return parseTodo(result.data);
}
