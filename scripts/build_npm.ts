// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./limit-concurrency.ts"],
  outDir: "./npm",
  shims: {
    deno: true,

    // workaround for https://github.com/shogo82148/limit-concurrency/issues/7
    customDev: [
      {
        module: "./custom_error_options.ts",
        globalNames: ["ErrorOptions"],
      },
    ],
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

  // workaround for https://github.com/shogo82148/limit-concurrency/issues/7
  typeCheck: false,

  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
