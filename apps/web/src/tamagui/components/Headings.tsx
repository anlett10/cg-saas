import { SizableText, styled } from "tamagui";

export const H1 = styled(SizableText, {
    render: "h1",
    fontFamily: "$heading",
    size: "$10",
    fontWeight: "700",
});

export const H3 = styled(SizableText, {
    render: "h3",
    fontFamily: "$heading",
    size: "$8",
    fontWeight: "600",
});

export const SubHeading = styled(SizableText, {
    size: "$4",
    color: "$color10",
    fontWeight: "400",
});
