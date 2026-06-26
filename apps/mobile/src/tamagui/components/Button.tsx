import { Button as TamaguiButton, styled, type GetProps } from "tamagui";

/** Takeout-style button variants — adapted from takeout-free. */
export const Button = styled(TamaguiButton, {
    borderWidth: 0,

    variants: {
        variant: {
            default: {
                bg: "$color3",
                pressStyle: { bg: "$color2", opacity: 0.8 },
            },
            outlined: {
                bg: "transparent",
                borderWidth: 2,
                borderColor: "$color6",
                pressStyle: { borderColor: "$color4", opacity: 0.8 },
            },
            transparent: {
                bg: "transparent",
                pressStyle: { bg: "$color2", opacity: 0.8 },
            },
        },
    } as const,

    defaultVariants: {
        variant: "default",
    },
});

export type ButtonProps = GetProps<typeof Button>;
