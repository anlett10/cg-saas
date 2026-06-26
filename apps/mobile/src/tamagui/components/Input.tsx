import {
    Input as TamaguiInput,
    styled,
    type GetProps,
} from "tamagui";

/** Takeout-style input — adapted from takeout-free. */
export const Input = styled(TamaguiInput, {
    height: 50,
    size: "$5",
    borderWidth: 0.5,
    borderColor: "$color6",
    bg: "$color2",
    placeholderTextColor: "$color8",
    focusStyle: {
        borderColor: "$color8",
        borderWidth: 0.5,
    },
});

export type InputProps = GetProps<typeof Input>;
