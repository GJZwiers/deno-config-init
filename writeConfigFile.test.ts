import {
  assert,
  assertEquals,
  assertRejects,
  assertSnapshot,
} from "./dev_deps.ts";
import {
  defaultOpts,
  inputHandler,
  Options,
  writeConfigFile,
} from "./writeConfigFile.ts";

Deno.test("writeConfigFile", async (context) => {
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
    name: "throws if config filename is not .json or .jsonc",
    fn: () => {
      testOpts.name = "deno.yaml";
      assertRejects(async () => {
        await writeConfigFile({}, testOpts);
      });
    },
  });

  await test({
    name: "create deno.json",
    fn: async () => {
      const output = await inputHandler(defaultOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");
      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create fmt options",
    only: true,
    fn: async () => {
      testOpts.fmt = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assertEquals(testOpts.name, "deno.json");
      assert(bytes.length > 0);

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create filled deno.jsonc if --fill is used",
    fn: async () => {
      testOpts.fill = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name:
      "create filled deno.jsonc with a specific section only if --fill is used together with another option",
    fn: async () => {
      testOpts.fmt = true;
      testOpts.fill = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create lint options",
    fn: async () => {
      testOpts.lint = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create compilerOptions",
    fn: async () => {
      testOpts.tsconfig = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create tasks",
    fn: async () => {
      testOpts.task = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create importMap",
    fn: async () => {
      testOpts.map = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create all if yes option is true",
    fn: async () => {
      testOpts.yes = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "can set a custom file name if yes option is true",
    fn: async () => {
      testOpts.yes = true;
      testOpts.name = "config.json";

      await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
    },
  });

  await test({
    name: "create test",
    fn: async () => {
      testOpts.test = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });
});
