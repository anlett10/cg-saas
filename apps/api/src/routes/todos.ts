import { db, todos, type Todo as TodoRow } from "@cg-saas/db";
import {
    createTodoBody,
    notFoundSchema,
    todoListSchema,
    todoSchema,
    updateTodoBody,
} from "@cg-saas/todos/schema";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

/** Serializes a DB row (with a `Date`) into the JSON-safe API shape. */
function serialize(todo: TodoRow) {
    return { ...todo, createdAt: todo.createdAt.toISOString() };
}

export const todosRoutes = new Elysia({ prefix: "/api/todos", name: "todos" })
    .get(
        "/",
        {
            response: { 200: todoListSchema },
        },
        async () => {
            const rows = await db.select().from(todos);
            return rows.map(serialize);
        },
    )
    .get(
        "/:id",
        {
            params: t.Object({ id: t.Numeric() }),
            response: {
                200: todoSchema,
                404: notFoundSchema,
            },
        },
        async ({ params, status }) => {
            const [todo] = await db
                .select()
                .from(todos)
                .where(eq(todos.id, params.id))
                .limit(1);

            if (!todo) {
                return status(404, { error: "Not found" });
            }

            return serialize(todo);
        },
    )
    .post(
        "/",
        {
            body: createTodoBody,
            response: { 201: todoSchema },
        },
        async ({ body, status }) => {
            const [todo] = await db.insert(todos).values(body).returning();
            return status(201, serialize(todo));
        },
    )
    .patch(
        "/:id",
        {
            params: t.Object({ id: t.Numeric() }),
            body: updateTodoBody,
            response: {
                200: todoSchema,
                404: notFoundSchema,
            },
        },
        async ({ params, body, status }) => {
            const [todo] = await db
                .update(todos)
                .set(body)
                .where(eq(todos.id, params.id))
                .returning();

            if (!todo) {
                return status(404, { error: "Not found" });
            }

            return serialize(todo);
        },
    )
    .delete(
        "/:id",
        {
            params: t.Object({ id: t.Numeric() }),
            response: {
                200: todoSchema,
                404: notFoundSchema,
            },
        },
        async ({ params, status }) => {
            const [todo] = await db
                .delete(todos)
                .where(eq(todos.id, params.id))
                .returning();

            if (!todo) {
                return status(404, { error: "Not found" });
            }

            return serialize(todo);
        },
    );
