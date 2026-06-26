import { createContext, useContext, useState, type ReactNode } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { useFonts } from "expo-font";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../tamagui/tamagui.config";
import {
    resolveTheme,
    type ThemeSetting,
} from "../tamagui/components/ThemeSwitch";

type ThemeContextValue = {
    setting: ThemeSetting;
    setSetting: (setting: ThemeSetting) => void;
    theme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeSetting() {
    const value = useContext(ThemeContext);
    if (!value) {
        throw new Error("useThemeSetting must be used within AppProvider");
    }
    return value;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const systemScheme = useColorScheme();
    const [setting, setSetting] = useState<ThemeSetting>("system");
    const theme = resolveTheme(setting, systemScheme);

    const [loaded] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    });

    if (!loaded) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeContext.Provider value={{ setting, setSetting, theme }}>
            <TamaguiProvider
                key={theme}
                config={tamaguiConfig}
                defaultTheme={theme}
            >
                {children}
            </TamaguiProvider>
        </ThemeContext.Provider>
    );
}
