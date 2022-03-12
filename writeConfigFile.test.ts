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
    defaults.name = "deno.json";
    defaults.jsonc = false;
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
      await inputHandler(defaults);

      const configFile = await Deno.readFile(
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.json");
      assert(configFile);
    },
  });

  await test({
    name: "create deno.jsonc",
    fn: async () => {
      defaults.jsonc = true;
      await inputHandler(defaults);

      const configFile = await Deno.readFile(
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.jsonc");
      assert(configFile);
    },
  });

  await test({
    name: "create fmt options",
    fn: async () => {
      testSettings.fmt = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.json");
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
        `${defaults.name}`,
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
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.compilerOptions);
    },
  });

  await test({
    name: "create all if yes option is true",
    fn: async () => {
      testSettings.yes = true;

      await inputHandler(testSettings);

      const configFile = await Deno.readFile(
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.json");
      assert(configFile);

      const contents = new TextDecoder().decode(configFile);
      const json = JSON.parse(contents);

      assert(json.fmt);
      assert(json.lint);
      assert(json.compilerOptions);
    },
  });
});
