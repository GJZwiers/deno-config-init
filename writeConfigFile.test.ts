import { assert, assertEquals } from "./dev_deps.ts";
import { defaults, inputHandler, Settings } from "./writeConfigFile.ts";

Deno.test("writeConfigFile()", async (context) => {
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
    testSettings.name = "deno.json";
    testSettings.jsonc = false;
    testSettings.map = false;
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
      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);
    },
  });

  await test({
    name: "create deno.jsonc",
    fn: async () => {
      testSettings.jsonc = true;
      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.jsonc");
      assert(configFile);
    },
  });

  await test({
    name: "create fmt options",
    only: true,
    fn: async () => {
      testSettings.fmt = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);
      assert(json.fmt);
    },
  });

  await test({
    name: "create lint options",
    fn: async () => {
      testSettings.lint = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(defaults.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.lint);
    },
  });

  await test({
    name: "create compilerOptions",
    fn: async () => {
      testSettings.tsconfig = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.compilerOptions);
    },
  });

  await test({
    name: "create tasks",
    fn: async () => {
      testSettings.tasks = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.tasks);
    },
  });

  await test({
    name: "create importMap",
    fn: async () => {
      testSettings.map = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assertEquals(json.importMap, "");
    },
  });

  await test({
    name: "create all if yes option is true",
    fn: async () => {
      testSettings.yes = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${testSettings.name}`,
      );

      assertEquals(testSettings.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.fmt);
      assert(json.lint);
      assert(json.compilerOptions);
    },
  });
});
