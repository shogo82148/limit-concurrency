// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
    entryPoints: ["./limit-concurrency.ts"],
    outDir: "./npm",
    shims: {
        deno: true,
    },
    package: {
        // package.json properties
        name: "@shogo82148/limit-concurrency",
        version: Deno.args[0],
        description: "Limit the concurrency of tasks.",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/shogo82148/limit-concurrency.git",
        },
        bugs: {
            url: "https://github.com/shogo82148/limit-concurrency/issues",
        },
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
