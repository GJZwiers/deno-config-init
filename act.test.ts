import { Rhum } from "./deps.ts";
import { act, defaultModuleContent, fetchTemplate, settings } from "./act.ts";

Rhum.testPlan("act.test.ts", () => {
  Rhum.testSuite("fetchTemplate()", () => {
    Rhum.afterEach(() => {
      settings.module = defaultModuleContent;
      settings.depsModule = defaultModuleContent;
    });

    Rhum.testCase("should fetch a template ", async () => {
      await fetchTemplate("deno");
    });

    Rhum.testCase("should error on non-existing template", () => {
      Rhum.asserts.assertThrowsAsync(async () => {
        await fetchTemplate("node");
      });
    });

    Rhum.testCase("should replace class modifiers", async () => {
      await fetchTemplate("drash");
    });
  });

  Rhum.testSuite("act()", () => {
    Rhum.afterEach(() => {
      settings.module = defaultModuleContent;
      settings.depsModule = defaultModuleContent;
      settings.entrypoint = "mod.ts";
      settings.depsEntrypoint = "deps.ts";
      settings.gitignore = ".gitignore";
    });

    Rhum.afterAll(() => {
    });

    Rhum.testCase(
      "should create the necessary project files in a directory with the chosen name",
      async () => {
        await act("vscode", "integration_test_directory");

        const bytes = await Deno.readFile("../mod.ts");
        Rhum.asserts.assertEquals(bytes, defaultModuleContent);

        try {
          Deno.chdir("../../");
          await Deno.remove("./integration_test_directory", {
            recursive: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );

    Rhum.testCase(
      "should create the necesary project files without specifying a name",
      async () => {
        settings.entrypoint = "mod-test.ts";
        settings.depsEntrypoint = "deps-test.ts";
        settings.gitignore = ".gitignore-test";

        await Deno.mkdir("./integration_test_directory");
        Deno.chdir("./integration_test_directory");

        // Create project in current dir
        await act("vscode", undefined);

        try {
          Deno.chdir("../../");
          await Deno.remove("./integration_test_directory", {
            recursive: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );

    Rhum.testCase(
      "should create the necesary project files when a template is specified",
      async () => {
        settings.entrypoint = "mod-test.ts";
        settings.depsEntrypoint = "deps-test.ts";
        settings.gitignore = ".gitignore-test";

        // Create project in current dir
        await act("vscode", "integration_test_directory", "oak");

        const bytes = await Deno.readFile("../mod-test.ts");
        Rhum.asserts.assertNotEquals(bytes.length, defaultModuleContent.length);

        try {
          Deno.chdir("../../");
          await Deno.remove("./integration_test_directory", {
            recursive: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );

    Rhum.testCase(
      "should create the necesary project files when a template is specified",
      async () => {
        settings.debug = "y";

        await act("vscode", "integration_test_directory");

        const bytes = await Deno.readFile("./launch.json");
        Rhum.asserts.assert(bytes.length);

        try {
          Deno.chdir("../../");
          await Deno.remove("./integration_test_directory", {
            recursive: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
    );
  });
});

Rhum.run();
