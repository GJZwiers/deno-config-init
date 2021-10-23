import { assert, assertEquals, assertThrowsAsync } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";

Deno.test("runCommand()", async (t) => {
  await t.step(
    "should return true when a command's exit code is 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "init"],
      });

      assertEquals(await runCommand(cmd), true);
    },
  );

  await t.step(
    "should return false when a command's exit code is greater than 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "checkout", "foo"],
      });

      assertEquals(await runCommand(cmd), false);
    },
  );
});

const settingsMock = self.structuredClone(defaults);

Deno.test("act()", async (t) => {
  settingsMock.path = "test_directory_act";

  const beforeEach = async () => {
    await Deno.mkdir(settingsMock.path, { recursive: true });
  };

  const afterEach = async () => {
    await Deno.remove(settingsMock.path, { recursive: true });
    settingsMock.config = false;
    settingsMock.configOnly = false;
    settingsMock.git = false;
    settingsMock.map = false;
  };

  await t.step(
    "should init git if settings.git is true",
    async () => {
      await beforeEach();

      settingsMock.git = true;

      await act(settingsMock);

      assert(`${settingsMock.path}/.git`);

      await afterEach();
    },
  );

  await t.step(
    "should create import_map.json if setting.map is true",
    async () => {
      await beforeEach();

      settingsMock.map = true;

      await act(settingsMock);

      const mapFile = await Deno.readFile(
        `${settingsMock.path}/import_map.json`,
      );

      assert(mapFile);

      await afterEach();
    },
  );

  await t.step(
    "should create deno.json if setting.config is true",
    async () => {
      await beforeEach();

      settingsMock.config = true;

      await act(settingsMock);

      const configFile = await Deno.readFile(
        `${settingsMock.path}/deno.json`,
      );

      assert(configFile);

      await afterEach();
    },
  );

  await t.step(
    "should create .test file for module entrypoint if settings.testdriven is true",
    async () => {
      await beforeEach();

      settingsMock.testdriven = true;

      await act(settingsMock);

      const mapFile = await Deno.readFile(
        `${settingsMock.path}/mod.test.ts`,
      );

      assert(mapFile);

      await afterEach();
    },
  );

  await t.step(
    "should only create configuration file(s) and no module entrypoints if settings.configOnly is true",
    async () => {
      await beforeEach();

      settingsMock.configOnly = true;

      await act(settingsMock);

      const configFile = await Deno.readFile(
        `${settingsMock.path}/deno.json`,
      );

      assert(configFile);

      await assertThrowsAsync(async () => {
        await Deno.readFile(`${settingsMock.path}/mod.ts`);
      });
      await assertThrowsAsync(async () => {
        await Deno.readFile(`${settingsMock.path}/deps.ts`);
      });
      await assertThrowsAsync(async () => {
        await Deno.readFile(`${settingsMock.path}/dev_deps.ts`);
      });

      await afterEach();
    },
  );
});
