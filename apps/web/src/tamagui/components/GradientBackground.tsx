import { LinearGradient } from "@tamagui/linear-gradient";
import { useTheme, YStack } from "tamagui";

export function GradientBackground({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();

    return (
        <YStack flex={1} minH="100vh" position="relative">
            <LinearGradient
                colors={[
                    theme.color1.val,
                    theme.color2.val,
                    theme.color3.val,
                    theme.color1.val,
                ]}
                locations={[0, 0.3, 0.6, 1]}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            />
            <YStack flex={1} position="relative" z={1}>
                {children}
            </YStack>
        </YStack>
    );
}
