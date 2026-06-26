const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(monorepoRoot, "node_modules"),
];

// Allow iPhone / Expo Go on LAN (not only localhost)
config.server = {
    ...config.server,
    host: "0.0.0.0",
};

module.exports = withTamagui(config, {
    components: ["tamagui"],
    config: "./tamagui.config.ts",
});
