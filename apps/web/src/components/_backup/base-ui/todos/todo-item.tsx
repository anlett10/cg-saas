import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { OctagonAlert } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useDeleteTodo, useUpdateTodo } from "@/hooks/use-todo-mutations";
import type { TodoView } from "@/lib/todos";
import { cn } from "@/lib/utils";

type TodoItemProps = {
    todo: TodoView;
    disabled?: boolean;
};

export function TodoItem({ todo, disabled = false }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const updateTodo = useUpdateTodo();
    const deleteTodo = useDeleteTodo();

    const busy = disabled || updateTodo.isPending || deleteTodo.isPending;
    const error = updateTodo.error?.message ?? deleteTodo.error?.message ?? null;

    const form = useForm({
        defaultValues: { title: todo.title },
        onSubmit: async ({ value }) => {
            const next = value.title.trim();

            if (next !== todo.title) {
                await updateTodo.mutateAsync({ id: todo.id, title: next });
            }

            setIsEditing(false);
        },
    });

    function startEditing() {
        form.reset({ title: todo.title });
        setIsEditing(true);
    }

    function cancelEditing() {
        form.reset({ title: todo.title });
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    form.handleSubmit();
                }}
                className="flex flex-col gap-1 px-4 py-3"
            >
                <div className="flex items-start gap-2">
                    <form.Field
                        name="title"
                        validators={{
                            onChange: ({ value }) =>
                                value.trim().length === 0
                                    ? "Title is required"
                                    : undefined,
                        }}
                    >
                        {(field) => (
                            <div className="flex-1">
                                <Input
                                    autoFocus
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Escape") {
                                            cancelEditing();
                                        }
                                    }}
                                    disabled={busy}
                                    aria-invalid={
                                        field.state.meta.isTouched &&
                                        field.state.meta.errors.length > 0
                                    }
                                />
                                {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 ? (
                                    <p className="mt-1 text-xs text-destructive">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => ({
                            canSubmit: state.canSubmit,
                            isSubmitting: state.isSubmitting,
                        })}
                    >
                        {({ canSubmit, isSubmitting }) => (
                            <Button
                                type="submit"
                                size="sm"
                                disabled={busy || !canSubmit || isSubmitting}
                            >
                                {isSubmitting || updateTodo.isPending
                                    ? "Saving…"
                                    : "Save"}
                            </Button>
                        )}
                    </form.Subscribe>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                </div>

                {error ? (
                    <p className="text-xs text-destructive">{error}</p>
                ) : null}
            </form>
        );
    }

    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={() =>
                    updateTodo.mutate({ id: todo.id, completed: !todo.completed })
                }
                disabled={busy}
                aria-label={`Mark "${todo.title}" as ${
                    todo.completed ? "incomplete" : "complete"
                }`}
            />
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        "truncate",
                        todo.completed &&
                            "text-muted-foreground line-through",
                    )}
                >
                    {todo.title}
                </p>
                <p className="text-xs text-muted-foreground">
                    {new Date(todo.createdAt).toLocaleString()}
                </p>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startEditing}
                disabled={busy}
            >
                Edit
            </Button>
            <AlertDialog>
                <AlertDialogTrigger
                    render={
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={busy}
                            className="text-destructive hover:text-destructive"
                        />
                    }
                >
                    Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <OctagonAlert className="size-5 shrink-0 fill-destructive/10 text-destructive" />
                        <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                        <AlertDialogDescription>
                            “{todo.title}” will be permanently removed. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteTodo.mutate(todo.id)}
                            className={buttonVariants({
                                variant: "destructive",
                            })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
