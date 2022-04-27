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
  let testSettings: Options;

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });

    Deno.chdir(testDir);
    testSettings = self.structuredClone(defaultOpts);
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
      testSettings.yes = true;

      const opt = randomElement(["fmt", "lint", "task", "tsconfig"]);

      switch (opt) {
        case "fmt":
          testSettings.fmt = true;
          break;
        case "lint":
          testSettings.lint = true;
          break;
        case "task":
          testSettings.task = true;
          break;
        case "tsconfig":
          testSettings.tsconfig = true;
          break;
      }

      assertThrows(() => {
        process(testSettings);
      });
    },
  });
});
