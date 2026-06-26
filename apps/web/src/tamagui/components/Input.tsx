import { Input as TamaguiInput, styled, type GetProps } from "tamagui";

export const Input = styled(TamaguiInput, {
    height: 50,
    size: "$5",
    borderWidth: 0.5,
    borderColor: "$color6",
    background: "$color2",
    placeholderTextColor: "$color8",
    focusStyle: {
        borderColor: "$color8",
        outlineWidth: 2,
        outlineStyle: "solid",
        outlineColor: "$color5",
    },
});

export type InputProps = GetProps<typeof Input>;
