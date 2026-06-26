import { SafeAreaProvider } from "react-native-safe-area-context";

import App from "../App";
import { AppProvider } from "./providers/AppProvider";

export function Root() {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <App />
            </AppProvider>
        </SafeAreaProvider>
    );
}
