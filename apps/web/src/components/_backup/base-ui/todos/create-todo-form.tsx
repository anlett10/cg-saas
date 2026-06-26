import { useForm } from "@tanstack/react-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateTodo } from "@/hooks/use-todo-mutations";

type CreateTodoValues = {
    title: string;
};

type CreateTodoFormProps = {
    disabled?: boolean;
};

export function CreateTodoForm({ disabled = false }: CreateTodoFormProps) {
    const createTodo = useCreateTodo();

    const form = useForm({
        defaultValues: {
            title: "",
        } satisfies CreateTodoValues,
        onSubmit: async ({ value, formApi }) => {
            await createTodo.mutateAsync(value.title.trim());
            formApi.reset();
        },
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}
            className="mb-6 flex flex-col gap-2"
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
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) =>
                                    field.handleChange(event.target.value)
                                }
                                placeholder="What needs to be done?"
                                disabled={
                                    disabled ||
                                    createTodo.isPending ||
                                    form.state.isSubmitting
                                }
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
                            disabled={
                                disabled ||
                                !canSubmit ||
                                isSubmitting ||
                                createTodo.isPending
                            }
                        >
                            {isSubmitting || createTodo.isPending
                                ? "Adding…"
                                : "Add"}
                        </Button>
                    )}
                </form.Subscribe>
            </div>

            {createTodo.error ? (
                <p className="text-sm text-destructive">
                    {createTodo.error.message}
                </p>
            ) : null}
        </form>
    );
}
