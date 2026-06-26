import { useColorScheme } from "react-native";
import { Button as TakeoutButton } from "./Button";
import { SizableText } from "tamagui";

export type ThemeSetting = "light" | "dark" | "system";

const settings: ThemeSetting[] = ["light", "dark", "system"];

const labels: Record<ThemeSetting, string> = {
    light: "☀️",
    dark: "🌙",
    system: "◐",
};

export function ThemeSwitch({
    setting,
    onChange,
}: {
    setting: ThemeSetting;
    onChange: (next: ThemeSetting) => void;
}) {
    function cycle() {
        const index = settings.indexOf(setting);
        const next = settings[(index + 1) % settings.length] ?? "system";
        onChange(next);
    }

    return (
        <TakeoutButton
            size="$3"
            circular
            variant="outlined"
            onPress={cycle}
            aria-label="Toggle theme"
        >
            <SizableText>{labels[setting]}</SizableText>
        </TakeoutButton>
    );
}

export function resolveTheme(
    setting: ThemeSetting,
    system: ReturnType<typeof useColorScheme>,
): "light" | "dark" {
    if (setting === "system") {
        return system === "dark" ? "dark" : "light";
    }
    return setting;
}
