import { Rhum } from "./dev_deps.ts";
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
    Rhum.beforeEach(async () => {
      await Deno.mkdir("./test_directory_act", { recursive: true });
    });

    Rhum.afterEach(async () => {
      await Deno.remove("./test_directory_act", { recursive: true });
    });

    Rhum.testCase(
      "should create import_map.json if setting.map is true",
      async () => {
        settings.map = true;
        settings.path = "test_directory_act";
        settings.git = false;

        await act();
      },
    );

    Rhum.testCase(
      "should create deno.json if setting.config is true",
      async () => {
        settings.config = true;
        settings.map = false;
        settings.path = "test_directory_act";
        settings.git = false;

        await act();

        const configFile = await Deno.readFile(
          "./test_directory_act/deno.json",
        );

        Rhum.asserts.assert(configFile);
      },
    );
  });
});

Rhum.run();
