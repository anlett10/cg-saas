/**
 * Production Bento API — import shared components from here.
 *
 * @example
 * import { Input, Chip, Alert } from '@/tamagui/bento'
 */

export { Input, useForwardFocus } from "./forms/inputs";
export { Switch } from "./forms/switches";
export { Checkbox, Checkboxes } from "./forms/checkboxes";
export { Chip } from "./elements/chips";
export { Alert, useAlert } from "./elements/dialogs";
export type { AlertButton, AlertParam } from "./elements/dialogs";

export {
    InputContext,
    defaultInputGroupStyles,
} from "./forms/inputs/components/inputsParts";

export { Chip as ChipParts } from "./elements/chips/components/chipsParts";
