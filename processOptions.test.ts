import { assertEquals, assertThrows } from "./dev_deps.ts";
import { process } from "./processOptions.ts";
import { defaultOpts, Options } from "./writeConfigFile.ts";

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
    name: "throw if --yes is used with --fmt",
    fn: () => {
      testOpts.yes = true;
      testOpts.fmt = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --lint",
    fn: () => {
      testOpts.yes = true;
      testOpts.lint = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --task",
    fn: () => {
      testOpts.yes = true;
      testOpts.task = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --tsconfig",
    fn: () => {
      testOpts.yes = true;
      testOpts.tsconfig = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --name",
    fn: () => {
      testOpts.yes = true;
      testOpts.name = "foo.json";

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --map",
    fn: () => {
      testOpts.yes = true;
      testOpts.map = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "Returns object with map: true if --map option is true",
    fn: () => {
      testOpts.map = true;

      const expected: Options = { ...defaultOpts, map: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with map: true if --task option is true",
    fn: () => {
      testOpts.task = true;

      const expected: Options = { ...defaultOpts, task: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with jsonc: true if --jsonc option is true",
    fn: () => {
      testOpts.jsonc = true;

      const expected: Options = { ...defaultOpts, jsonc: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with tsconfig: true if --tsconfig option is true",
    fn: () => {
      testOpts.tsconfig = true;

      const expected: Options = { ...defaultOpts, tsconfig: true };

      assertEquals(process(testOpts), expected);
    },
  });
});
