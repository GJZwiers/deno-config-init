import { assert, assertEquals, assertSnapshot } from "./dev_deps.ts";
import { defaults, inputHandler, Settings } from "./writeConfigFile.ts";

Deno.test("isSnapshotMatch", async (test) => {
  const config = {
    fmt: {
      files: {
        exclude: [],
        include: []
      },
      options: {},
    },
  };
  await assertSnapshot(test, config);
});

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
    testSettings.map = false;
    testSettings.fill = false;
    testSettings.fmt = false;
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
    name: "create filled deno.jsonc if --fill is used",
    fn: async () => {
      testSettings.fill = true;
      await inputHandler(testSettings);

      assertEquals(testSettings.name, "deno.jsonc");

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      const file = new TextDecoder().decode(bytes);

      assert(file.indexOf("fmt") > 0);
      assert(file.indexOf("lint") > 0);
      assert(file.indexOf("importMap") > 0);
      assert(file.indexOf("compilerOptions") > 0);
      assert(file.indexOf("tasks") > 0);
    },
  });

  await test({
    name:
      "create deno.jsonc with fmt section only if fill is used in combination with fmt",
    fn: async () => {
      testSettings.fill = true;
      testSettings.fmt = true;
      await inputHandler(testSettings);

      const bytes = await Deno.readFile(
        `${testSettings.name}`,
      );

      const file = new TextDecoder().decode(bytes);

      assert(file.indexOf("fmt") > 0);

      assert(file.indexOf("lint") === -1);
      assert(file.indexOf("importMap") === -1);
      assert(file.indexOf("compilerOptions") === -1);
      assert(file.indexOf("tasks") === -1);
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
      testSettings.task = true;

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
