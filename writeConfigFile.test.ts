import { assert, assertEquals, assertSnapshot } from "./dev_deps.ts";
import { defaults, inputHandler, Settings } from "./writeConfigFile.ts";

Deno.test("writeConfigFile", async (context) => {
  const testDir = "test_directory";
  let testSettings: Settings;

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });

    Deno.chdir(testDir);
    testSettings = self.structuredClone(defaults);
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
    name: "create deno.json",
    fn: async () => {
      const output = await inputHandler(defaults);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");
      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create fmt options",
    only: true,
    fn: async () => {
      testSettings.fmt = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(bytes.length > 0);

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create filled deno.jsonc if --fill is used",
    fn: async () => {
      testSettings.fill = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name:
      "create filled deno.jsonc with a specific section only if --fill is used together with another option",
    fn: async () => {
      testSettings.fmt = true;
      testSettings.fill = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create lint options",
    fn: async () => {
      testSettings.lint = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create compilerOptions",
    fn: async () => {
      testSettings.tsconfig = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create tasks",
    fn: async () => {
      testSettings.task = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create importMap",
    fn: async () => {
      testSettings.map = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create fmt, lint, compilerOptions and tasks if yes option is true",
    fn: async () => {
      testSettings.yes = true;

      const output = await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testSettings.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });
});
