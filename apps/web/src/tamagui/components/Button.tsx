import { Button as TamaguiButton, styled, type GetProps } from "tamagui";

const ButtonFrame = styled(TamaguiButton, {
    render: "button",
    borderWidth: 0,
    cursor: "pointer",

    variants: {
        pressTheme: {
            true: {},
            false: {},
        },
        variant: {
            default: {
                backgroundColor: "$color3",
                hoverStyle: { backgroundColor: "$color4" },
                pressStyle: { backgroundColor: "$color2", opacity: 0.8 },
            },
            outlined: {
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: "$color6",
                hoverStyle: { borderColor: "$color8" },
                pressStyle: { borderColor: "$color4", opacity: 0.8 },
            },
            transparent: {
                backgroundColor: "transparent",
                hoverStyle: { backgroundColor: "$color2" },
                pressStyle: { backgroundColor: "$color1", opacity: 0.8 },
            },
        },
    } as const,

    defaultVariants: {
        variant: "default",
        pressTheme: true,
    },
});

export const Button = ButtonFrame.styleable((props, ref) => {
    const { pressTheme: _pressTheme, ...rest } = props as typeof props & {
        pressTheme?: boolean;
    };
    return <ButtonFrame ref={ref} {...rest} />;
});

export type ButtonProps = GetProps<typeof Button>;
