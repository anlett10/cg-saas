module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "@tamagui/babel-plugin",
                {
                    components: ["tamagui"],
                    config: "./tamagui.config.ts",
                },
            ],
            // Reanimated/worklets plugin is added automatically by babel-preset-expo
            // when react-native-worklets is installed — do not add it again here.
        ],
    };
};
