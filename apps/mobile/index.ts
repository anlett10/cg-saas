import "react-native-reanimated";
import "@tamagui/native/setup-expo-linear-gradient";

import { registerRootComponent } from "expo";

import "./src/tamagui/tamagui.config";

import { Root } from "./src/Root";

registerRootComponent(Root);
