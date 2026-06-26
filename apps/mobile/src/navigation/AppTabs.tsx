import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "tamagui";

import { HomeScreen } from "../screens/HomeScreen";
import { TodosScreen } from "../screens/TodosScreen";

export type AppTabParamList = {
    Home: undefined;
    Todos: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.color11.val,
                tabBarInactiveTintColor: theme.color9.val,
                tabBarStyle: {
                    backgroundColor: theme.background.val,
                    borderTopColor: theme.borderColor.val,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Todos"
                component={TodosScreen}
                options={{
                    tabBarLabel: "Todos",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="checkbox-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
