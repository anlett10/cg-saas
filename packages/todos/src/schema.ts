import {
    Array as TArray,
    Boolean as TBoolean,
    Number as TNumber,
    Object as TObject,
    Optional as TOptional,
    String as TString,
    type Static,
} from "typebox";

/**
 * Shared todo contract — the single source of truth for both the Elysia server
 * (request/response validation) and the client (runtime response parsing).
 *
 * Built on standalone `typebox` (not Elysia's `t`) so it stays framework-neutral
 * and browser-safe: importing this module never pulls Elysia into the client
 * bundle. Elysia v2 accepts these schemas directly for route validation.
 *
 * `createdAt` is an ISO-8601 string: the API serializes the DB `Date` to a
 * string, giving one JSON-safe shape end to end (no Date/serialization drift).
 */
export const todoSchema = TObject({
    id: TNumber(),
    title: TString(),
    completed: TBoolean(),
    createdAt: TString(),
});

export const todoListSchema = TArray(todoSchema);

export const notFoundSchema = TObject({
    error: TString(),
});

export const createTodoBody = TObject({
    title: TString(),
    completed: TOptional(TBoolean()),
});

export const updateTodoBody = TObject({
    title: TOptional(TString()),
    completed: TOptional(TBoolean()),
});

/** Canonical todo shape derived from `todoSchema` (JSON-safe, `createdAt: string`). */
export type Todo = Static<typeof todoSchema>;
