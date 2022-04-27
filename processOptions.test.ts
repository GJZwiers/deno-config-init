import { assertThrows } from "./dev_deps.ts";
import { process } from "./processOptions.ts";
import { defaultOpts, Options } from "./writeConfigFile.ts";

function randomElement(array: string[]) {
  const rand = Math.random() * array.length | 0;
  const rValue = array[rand];
  return rValue;
}

Deno.test("processOptions", async (context) => {
  const testDir = "test_directory";
  let testOpts: Options;

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });

    Deno.chdir(testDir);
    testOpts = self.structuredClone(defaultOpts);
  };

  const afterEach = async () => {
    Deno.chdir("..");

    await Deno.remove(testDir, { recursive: true });
  };

  const test = async (
    options: Deno.TestDefinition,
  ) => {
    await beforeEach();

    await context.step(options);

    await afterEach();
  };

  await test({
    name: "throw if --yes is used with an option other than --name or --map",
    fn: () => {
      testOpts.yes = true;

      const opt = randomElement(["fmt", "lint", "task", "tsconfig"]);

      switch (opt) {
        case "fmt":
          testOpts.fmt = true;
          break;
        case "lint":
          testOpts.lint = true;
          break;
        case "task":
          testOpts.task = true;
          break;
        case "tsconfig":
          testOpts.tsconfig = true;
          break;
      }

      assertThrows(() => {
        process(testOpts);
      });
    },
  });
});
