import { XStack, YStack } from "tamagui";

import { useThemeSetting } from "../providers/AppProvider";
import { H1, SubHeading } from "../tamagui/components/Headings";
import { ThemeSwitch } from "../tamagui/components/ThemeSwitch";

export function ScreenHeader({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    const { setting, setSetting } = useThemeSetting();

    return (
        <XStack items="center" justify="space-between" gap="$3">
            <YStack flex={1} gap="$1">
                <H1 size="$8">{title}</H1>
                {subtitle ? <SubHeading>{subtitle}</SubHeading> : null}
            </YStack>
            <ThemeSwitch setting={setting} onChange={setSetting} />
        </XStack>
    );
}
