/**
 * Takeout / Bento sub-themes on top of Tamagui v5 defaults.
 * Adds alt1, alt2, active, surface3 grandchildren Bento demos expect.
 */
import {
    createThemes,
    createV5Theme,
    defaultChildrenThemes,
    defaultDarkPalette,
    defaultLightPalette,
    v5GrandchildrenThemes,
    v5Templates,
} from "@tamagui/config/v5";

/** Muted text variants — color-only templates inheriting parent background. */
function createBentoAltTemplates() {
    const templates: Record<string, Record<string, number>> = {};

    for (const scheme of ["light", "dark"] as const) {
        const color = -7;

        templates[`${scheme}_alt1`] = {
            color: color - 1,
            colorHover: color - 2,
            colorPress: color - 1,
            colorFocus: color - 2,
        };
        templates[`${scheme}_alt2`] = {
            color: color - 2,
            colorHover: color - 3,
            colorPress: color - 2,
            colorFocus: color - 3,
        };
        templates[`${scheme}_active`] = v5Templates[`${scheme}_surface3`];
    }

    return templates;
}

const bentoGrandChildrenThemes = {
    ...v5GrandchildrenThemes,
    surface3: { template: "surface3" as const },
    alt1: { template: "alt1" as const },
    alt2: { template: "alt2" as const },
    active: { template: "active" as const },
};

function createBentoChildrenThemes() {
    return Object.fromEntries(
        Object.entries(defaultChildrenThemes).map(([name, theme]) => [
            name,
            {
                palette: {
                    light: Object.values(theme.light),
                    dark: Object.values(theme.dark),
                },
            },
        ]),
    );
}

/** v5 themes + Takeout sub-themes (alt1, alt2, active, surface3). */
export function createTakeoutThemes() {
    const baseThemes = createV5Theme();
    const templates = { ...v5Templates, ...createBentoAltTemplates() };

    const takeoutExtras = createThemes({
        componentThemes: false,
        templates,
        base: {
            palette: {
                light: defaultLightPalette,
                dark: defaultDarkPalette,
            },
        },
        accent: {
            palette: {
                dark: defaultLightPalette,
                light: defaultDarkPalette,
            },
        },
        childrenThemes: createBentoChildrenThemes(),
        grandChildrenThemes: bentoGrandChildrenThemes,
    });

    return {
        ...baseThemes,
        ...Object.fromEntries(
            Object.entries(takeoutExtras).filter(([name]) => !(name in baseThemes)),
        ),
    };
}

export const takeoutThemes = createTakeoutThemes();
