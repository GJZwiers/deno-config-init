import { assertThrowsAsync, Rhum } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { defaults } from "./settings.ts";

Rhum.testPlan("act.test.ts", () => {
  const settingsMock = self.structuredClone(defaults);

  Rhum.testSuite("runCommand()", () => {
    Rhum.testCase(
      "should return true when a command's exit code is 0",
      async () => {
        const cmd = Deno.run({
          cmd: ["git", "init"],
        });

        Rhum.asserts.assertEquals(await runCommand(cmd), true);
      },
    );

    Rhum.testCase(
      "should return false when a command's exit code is greater than 0",
      async () => {
        const cmd = Deno.run({
          cmd: ["git", "checkout", "foo"],
        });

        Rhum.asserts.assertEquals(await runCommand(cmd), false);
      },
    );
  });

  Rhum.testSuite("act()", () => {
    Rhum.beforeAll(() => {
      settingsMock.git = false;
      settingsMock.path = "test_directory_act";
    });

    Rhum.beforeEach(async () => {
      await Deno.mkdir(settingsMock.path, { recursive: true });
    });

    Rhum.afterEach(async () => {
      await Deno.remove(settingsMock.path, { recursive: true });
    });

    Rhum.testCase(
      "should init git if settings.git is true",
      async () => {
        settingsMock.git = true;

        await act(settingsMock);

        Rhum.asserts.assertExists(
          `${settingsMock.path}/.git`,
        );

        settingsMock.git = false;
      },
    );

    Rhum.testCase(
      "should create import_map.json if setting.map is true",
      async () => {
        settingsMock.map = true;

        await act(settingsMock);

        const mapFile = await Deno.readFile(
          `${settingsMock.path}/import_map.json`,
        );

        Rhum.asserts.assert(mapFile);
      },
    );

    Rhum.testCase(
      "should create deno.json if setting.config is true",
      async () => {
        settingsMock.config = true;
        settingsMock.map = false;
        settingsMock.git = false;

        await act(settingsMock);

        const configFile = await Deno.readFile(
          `${settingsMock.path}/deno.json`,
        );

        Rhum.asserts.assert(configFile);
      },
    );

    Rhum.testCase(
      "should create .test file for module entrypoint if settings.testdriven is true",
      async () => {
        settingsMock.testdriven = true;
        settingsMock.map = false;
        settingsMock.git = false;

        await act(settingsMock);

        const mapFile = await Deno.readFile(
          `${settingsMock.path}/mod.test.ts`,
        );

        Rhum.asserts.assert(mapFile);
      },
    );

    Rhum.testCase(
      "should only create configuration file(s) and no module entrypoints if settings.configOnly is true",
      async () => {
        settingsMock.configOnly = true;
        settingsMock.map = false;
        settingsMock.git = false;

        await act(settingsMock);

        const configFile = await Deno.readFile(
          `${settingsMock.path}/deno.json`,
        );

        Rhum.asserts.assert(configFile);

        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settingsMock.path}/mod.ts`);
        });
        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settingsMock.path}/deps.ts`);
        });
        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settingsMock.path}/dev_deps.ts`);
        });
      },
    );
  });
});

Rhum.run();
