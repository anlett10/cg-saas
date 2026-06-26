import { Link } from "@tanstack/react-router";

import { CreateTodoForm } from "./create-todo-form";
import { TodoItem } from "./todo-item";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useTodos } from "@/hooks/use-todos";

export function TodosPage() {
    const {
        data: todos = [],
        isLoading,
        error,
        refetch,
        isFetching,
    } = useTodos();

    return (
        <div className="mx-auto max-w-2xl p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
                <Button
                    render={<Link to="/" />}
                    nativeButton={false}
                    variant="ghost"
                    size="sm"
                >
                    ← Home
                </Button>
            </div>

            <CreateTodoForm />

            {isLoading ? (
                <p className="text-muted-foreground">Loading todos…</p>
            ) : error ? (
                <p className="text-sm text-destructive">{error.message}</p>
            ) : null}

            {!isLoading && !error && todos.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No todos yet</CardTitle>
                        <CardDescription>
                            Add your first todo using the field above.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : null}

            {todos.length > 0 ? (
                <Card className="py-0">
                    <CardContent className="divide-y px-0">
                        {todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </CardContent>
                </Card>
            ) : null}

            <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-4 px-0 text-muted-foreground"
            >
                {isFetching ? "Refreshing…" : "Refresh"}
            </Button>
        </div>
    );
}
