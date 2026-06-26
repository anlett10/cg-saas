import { LinearGradient } from "@tamagui/linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, View } from "tamagui";

/** Soft gradient using active theme tokens — inspired by takeout-free. */
export function GradientBackground({
    children,
    useInsets = true,
}: {
    children: React.ReactNode;
    useInsets?: boolean;
}) {
    const inset = useSafeAreaInsets();
    const theme = useTheme();

    const color1 = theme.color1.val;
    const color2 = theme.color2.val;
    const color3 = theme.color3.val;

    return (
        <View flex={1} pb={useInsets ? inset.bottom : 0}>
            <LinearGradient
                colors={[color1, color2, color3, color1]}
                locations={[0, 0.3, 0.6, 1]}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                }}
            />
            {children}
        </View>
    );
}
