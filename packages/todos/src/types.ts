import { Value } from "typebox/value";

import { todoSchema, type Todo } from "./schema";

/**
 * Serializable todo for React and SSR dehydration. Derived from the shared
 * `todoSchema`, so the client view and the server contract can never drift.
 */
export type TodoView = Todo;

/**
 * Validates an untyped API payload into a `TodoView` using the shared TypeBox
 * schema. We parse rather than cast because, under the current Elysia v2 / Eden
 * pairing, Eden cannot resolve the response schema's static type (it surfaces
 * `data` as `unknown`). Validating against the single source of truth keeps the
 * boundary honest with zero hand-written field checks.
 */
export function parseTodo(value: unknown): TodoView {
    return Value.Parse(todoSchema, value);
}
