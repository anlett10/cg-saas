import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

import { animationsNative } from "./animations.native";
import { fonts } from "./fonts";

export const tamaguiConfig = createTamagui({
    ...defaultConfig,
    animations: animationsNative,
    fonts,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}

    interface TypeOverride {
        groupNames(): "button" | "item" | "card" | "frame";
    }
}
