import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import { useThemeSetting } from "../providers/AppProvider";
import { GradientBackground } from "../tamagui/components/GradientBackground";

export function ScreenLayout({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
    const { theme } = useThemeSetting();

    return (
        <GradientBackground useInsets={false}>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <YStack flex={1} pt={insets.top + 8} px="$4" gap="$4">
                {children}
            </YStack>
        </GradientBackground>
    );
}
