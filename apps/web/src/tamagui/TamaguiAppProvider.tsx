import { useState, type ReactNode } from "react";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "./tamagui.config";

export function TamaguiAppProvider({ children }: { children: ReactNode }) {
    const [theme] = useState<"light" | "dark">("light");

    return (
        <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
            {children}
        </TamaguiProvider>
    );
}
