import { Rhum } from "./dev_deps.ts";
import {
  act,
  editorConfigs,
  initProjectSettings,
  runCommand,
  settings,
  processTemplateDir,
} from "./act.ts";

Rhum.testPlan("act.test.ts", () => {
  Rhum.testSuite("processTemplateDir()", () => {
    const entrypoint = "mod";
    const dirName = "test_templates_directory";

    Rhum.beforeAll(async () => {
      settings.path = "test_directory";
      await Deno.mkdir(dirName);
      Deno.chdir(dirName);
      await Deno.writeFile(entrypoint, new TextEncoder().encode("Test"));
      await Deno.mkdir("nested");
      Deno.chdir("nested");
      await Deno.writeFile(entrypoint, new TextEncoder().encode("Nest"));

      Deno.chdir("../..");
    });

    Rhum.afterAll(async () => {
      await Deno.remove(dirName, { recursive: true });
      settings.path = ".";
    });

    Rhum.beforeEach(async () => {
      await Deno.mkdir(settings.path);
    });

    Rhum.afterEach(async () => {
      await Deno.remove(settings.path, { recursive: true });
    });

    Rhum.testCase(
      "should add processed template files to a given directory",
      async () => {
        await processTemplateDir(dirName, settings.path);

        const file = await Deno.open(settings.path + "/" + entrypoint + ".ts");
        Rhum.asserts.assert(file);
        Deno.close(file.rid);

        const nestedFile = await Deno.open(
          settings.path + "/nested/" + entrypoint + ".ts",
        );
        Rhum.asserts.assert(nestedFile);
        Deno.close(nestedFile.rid);
      },
    );
  });

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

  Rhum.testSuite("initProjectSettings()", () => {
    Rhum.beforeAll(() => {
      settings.editor = "vscode";
      settings.path = "test";
    });

    Rhum.beforeEach(async () => {
      await Deno.mkdir(settings.path);
    });

    Rhum.afterEach(async () => {
      await Deno.remove(settings.path, { recursive: true });
    });

    Rhum.testCase(
      "should make a settings directory based on the specified editor",
      async () => {
        settings.debug = "n";

        await initProjectSettings();

        const dir = settings.path + "/" + editorConfigs["vscode"].settingsDir;

        await Rhum.asserts.assertThrowsAsync(async () => {
          await Deno.mkdir(dir);
        });
      },
    );

    Rhum.testCase(
      "should make a debug configfile when settings.debug is yes",
      async () => {
        settings.debug = "y";

        const debugFile = settings.path + "/" +
          editorConfigs[settings.editor].debugFile;

        await initProjectSettings();

        await Rhum.asserts.assertThrowsAsync(async () => {
          await Deno.readFile(debugFile);
        });
      },
    );
  });

  Rhum.testSuite("act()", () => {
    Rhum.beforeAll(async () => {
      await Deno.mkdir("test_directory_act");
    });

    Rhum.afterAll(async () => {
      await Deno.remove("test_directory_act", { recursive: true });
    });

    Rhum.testCase(
      "should make project settings if no other options are passed",
      async () => {
        settings.path = "test_directory_act";
        settings.debug = "n";
        settings.template = "";
        settings.git = false;

        await act();

        await Rhum.asserts.assertThrowsAsync(async () => {
          await Deno.mkdir(
            settings.path + "/" + editorConfigs[settings.editor].settingsDir,
          );
        });
      },
    );

    Rhum.testCase(
      "should make a project from a template when template is passed",
      async () => {
        settings.path = "test_directory_act";
        settings.debug = "n";
        settings.template = "deno";
        settings.git = false;

        await act();

        Rhum.asserts.assert(async () => {
          await Deno.writeFile(
            "test_directory_act/mod.ts",
            new TextEncoder().encode("export {};"),
            { create: false },
          );
        });
      },
    );

    Rhum.testCase(
      "should make a project from a template when template is passed",
      async () => {
        settings.path = "test_directory_act";
        settings.debug = "n";
        settings.template = "";
        settings.git = true;

        await act();

        Rhum.asserts.assert(async () => {
          await Deno.writeFile(
            "test_directory_act/mod.ts",
            new TextEncoder().encode("export {};"),
            { create: false },
          );
        });
      },
    );
  });
});

Rhum.run();
