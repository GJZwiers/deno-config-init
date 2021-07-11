import { Rhum } from "./dev_deps.ts";
import { hasFileExtension, mkdirOrWarn, writeFileOrWarn } from "./utils.ts";
import { settings } from "./act.ts";

const testFilePath = "./foo.ts";
const testDirPath = "./dir";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const testFileContent = encoder.encode("foo");

Rhum.testPlan("utils.test.ts", () => {
  Rhum.testSuite("writeFileOrWarn()", () => {
    Rhum.afterEach(async () => {
      try {
        await Deno.remove(testFilePath, { recursive: true });
      } catch (_error) {
        console.log("Could not remove file");
      }
    });

    Rhum.testCase(
      "should write a new file if the path does not exist yet",
      async () => {
        await writeFileOrWarn(testFilePath, testFileContent);
        const file = await Deno.readFile(testFilePath);

        Rhum.asserts.assertEquals(decoder.decode(file), "foo");
      },
    );

    Rhum.testCase("should overwrite when the force flag is set", async () => {
      settings.force = false;
      await writeFileOrWarn(testFilePath, testFileContent);
      settings.force = true;
      await writeFileOrWarn(testFilePath, encoder.encode("bar"));

      const file = await Deno.readFile(testFilePath);

      Rhum.asserts.assertEquals(decoder.decode(file), "bar");
      settings.force = false;
    });

    Rhum.testCase("should warn when file already exists", async () => {
      await Deno.writeFile(testFilePath, testFileContent);
      await writeFileOrWarn(testFilePath, testFileContent);
    });
  });

  Rhum.testSuite("mkdirOrWarn()", () => {
    Rhum.afterEach(async () => {
      await Deno.remove(testDirPath);
    });

    Rhum.testCase(
      "should make a new directory if it does not exist yet",
      async () => {
        await mkdirOrWarn(testDirPath);

        await Rhum.asserts.assertThrowsAsync(() => {
          return Deno.mkdir(testDirPath);
        });
      },
    );

    Rhum.testCase("should warn when directory already exists", async () => {
      await Deno.mkdir(testDirPath);
      await mkdirOrWarn(testDirPath);
    });

    Rhum.testCase(
      "should not warn when directory already exists and force flag is set",
      async () => {
        await Deno.mkdir(testDirPath);
        settings.force = true;
        await mkdirOrWarn(testDirPath);
        settings.force = false;
      },
    );
  });

  Rhum.testSuite("hasFileExtension()", () => {
    Rhum.testCase("should validate a filename correctly", () => {
      Rhum.asserts.assertEquals(hasFileExtension("mod.ts", "ts"), true);
      Rhum.asserts.assertEquals(hasFileExtension("mod.ts", "js"), false);
      Rhum.asserts.assertEquals(hasFileExtension("mod", "ts"), false);
    });
  });
});

Rhum.run();
