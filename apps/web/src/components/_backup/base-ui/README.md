# Base UI backup (shadcn-style)

Archived web UI built with **@base-ui/react** + **Tailwind CSS**.

The active web app uses **Tamagui** (`apps/web/src/tamagui/`). These files are kept for reference and can be restored if needed.

| Folder | Contents |
| --- | --- |
| `ui/` | Button, Input, Card, Checkbox, AlertDialog, Label |
| `todos/` | TodosPage, TodoItem, CreateTodoForm (Base UI versions) |

Restore by moving `ui/` and `todos/` back to `src/components/` and reverting route imports.
