import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import css from "rollup-plugin-css-only";

export default {
    input: "scripts/main.ts",
    output: {
        file: "build/main.js",
        format: "esm",
        sourcemap: true,
    },
    plugins: [typescript(), resolve(), css({ output: "build/bundle.css" })],
};
