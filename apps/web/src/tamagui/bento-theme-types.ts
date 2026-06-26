/**
 * Bento / Takeout sub-theme names used as `theme="alt1"` etc.
 */
export type BentoSubThemeName =
    | "alt1"
    | "alt2"
    | "active"
    | "surface1"
    | "surface2"
    | "surface3";

import type { ThemeName } from "tamagui";

/** Cast Takeout sub-themes for Tamagui `theme` prop until config keys infer them. */
export function bentoTheme(name: BentoSubThemeName): ThemeName {
    return name as ThemeName;
}

declare module "tamagui" {
    interface TypeOverride {
        groupNames(): "button" | "item" | "card" | "frame";
    }
}

declare module "@tamagui/core" {
    interface TypeOverride {
        groupNames(): "button" | "item" | "card" | "frame";
    }
}
