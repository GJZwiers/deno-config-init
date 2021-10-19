import { Rhum, assertThrowsAsync } from "./dev_deps.ts";
import { act, runCommand } from "./act.ts";
import { settings } from "./settings.ts";

Rhum.testPlan("act.test.ts", () => {
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
      settings.git = false;
      settings.path = "test_directory_act";
    });

    Rhum.beforeEach(async () => {
      await Deno.mkdir(settings.path, { recursive: true });
    });

    Rhum.afterEach(async () => {
      await Deno.remove(settings.path, { recursive: true });
    });

    Rhum.testCase(
      "should init git if settings.git is true",
      async () => {
        settings.git = true;

        await act();

        Rhum.asserts.assertExists(
          `${settings.path}/.git`,
        );

        settings.git = false;
      },
    );

    Rhum.testCase(
      "should create import_map.json if setting.map is true",
      async () => {
        settings.map = true;

        await act();

        const mapFile = await Deno.readFile(
          `${settings.path}/import_map.json`,
        );

        Rhum.asserts.assert(mapFile);
      },
    );

    Rhum.testCase(
      "should create deno.json if setting.config is true",
      async () => {
        settings.config = true;
        settings.map = false;
        settings.git = false;

        await act();

        const configFile = await Deno.readFile(
          `${settings.path}/deno.json`,
        );

        Rhum.asserts.assert(configFile);
      },
    );

    Rhum.testCase(
      "should create .test file for module entrypoint if settings.testdriven is true",
      async () => {
        settings.testdriven = true;
        settings.map = false;
        settings.git = false;

        await act();

        const mapFile = await Deno.readFile(
          `${settings.path}/mod.test.ts`,
        );

        Rhum.asserts.assert(mapFile);
      },
    );

    Rhum.testCase(
      "should only create configuration file(s) and no module entrypoints if settings.configOnly is true",
      async () => {
        settings.configOnly = true;
        settings.map = false;
        settings.git = false;

        await act();

        const configFile = await Deno.readFile(
          `${settings.path}/deno.json`,
        );

        Rhum.asserts.assert(configFile);

        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settings.path}/mod.ts`);
        });
        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settings.path}/deps.ts`);
        });
        await assertThrowsAsync(async () => {
          await Deno.readFile(`${settings.path}/dev_deps.ts`);
        });
      },
    );
  });
});

Rhum.run();
