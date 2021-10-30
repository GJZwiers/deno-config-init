import { assert, assertEquals, assertThrowsAsync } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";
import { sinon } from "./dev_deps.ts";

Deno.test("runCommand()", async (test) => {
  await test.step(
    "return true when a command's exit code is 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "init"],
        stdout: "null",
      });

      assertEquals(await runCommand(cmd), true);
    },
  );

  await test.step(
    "return false when a command's exit code is greater than 0",
    async () => {
      const cmd = Deno.run({
        cmd: ["git", "checkout", "foo"],
        stderr: "null",
      });

      assertEquals(await runCommand(cmd), false);
    },
  );
});

// const defaults = self.structuredClone(defaults);

Deno.test("act()", async (test) => {
  defaults.name = "test_directory_act";

  const beforeEach = async () => {
    await Deno.mkdir(defaults.name, { recursive: true });
  };

  const afterEach = async () => {
    await Deno.remove(defaults.name, { recursive: true });
    defaults.config = false;
    defaults.configOnly = false;
    defaults.git = false;
    defaults.map = false;
  };

  await test.step(
    "initialize git if settings.git is true",
    async () => {
      await beforeEach();

      defaults.git = true;

      const spy = sinon.spy(defaults, "initGit");
      const addSpy = sinon.spy(defaults, "addProjectFile");

      await act(defaults);

      assertEquals(spy.called, true);

      assertEquals(addSpy.called, true);
      assertEquals(addSpy.getCalls().length, 4);

      assert(`${defaults.name}/.git`);

      await afterEach();
    },
  );

  await test.step(
    "create import_map.json if settings.map is true",
    async () => {
      await beforeEach();

      defaults.map = true;

      await act(defaults);

      const mapFile = await Deno.readFile(
        `${defaults.name}/import_map.json`,
      );

      assert(mapFile);

      await afterEach();
    },
  );

  await test.step(
    "create deno.json if settings.config is true",
    async () => {
      await beforeEach();

      defaults.config = true;

      await act(defaults);

      const configFile = await Deno.readFile(
        `${defaults.name}/deno.json`,
      );

      assert(configFile);

      await afterEach();
    },
  );

  await test.step(
    "create .test file for module entrypoint if settings.testdriven is true",
    async () => {
      await beforeEach();

      defaults.testdriven = true;

      await act(defaults);

      const mapFile = await Deno.readFile(
        `${defaults.name}/mod.test.ts`,
      );

      assert(mapFile);

      await afterEach();
    },
  );

  await test.step(
    "only create configuration file(s) and no module entrypoints if settings.configOnly is true",
    async () => {
      await beforeEach();

      defaults.configOnly = true;

      await act(defaults);

      const configFile = await Deno.readFile(
        `${defaults.name}/deno.json`,
      );

      assert(configFile);

      await assertThrowsAsync(async () => {
        await Deno.readFile(`${defaults.name}/mod.ts`);
      });
      await assertThrowsAsync(async () => {
        await Deno.readFile(`${defaults.name}/deps.ts`);
      });
      await assertThrowsAsync(async () => {
        await Deno.readFile(`${defaults.name}/dev_deps.ts`);
      });

      await afterEach();
    },
  );
});
