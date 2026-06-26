import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from "@react-navigation/native";

import { useThemeSetting } from "./src/providers/AppProvider";
import { AppTabs } from "./src/navigation/AppTabs";

export default function App() {
    const { theme } = useThemeSetting();

    return (
        <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
            <AppTabs />
        </NavigationContainer>
    );
}
