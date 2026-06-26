import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

import { takeoutThemes } from "./bento-themes";
import "./bento-theme-types";
import { animationsCSS } from "./animations.css";
import { fonts } from "./fonts";

export const tamaguiConfig = createTamagui({
    ...defaultConfig,
    themes: takeoutThemes,
    animations: animationsCSS,
    fonts,
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}
}
