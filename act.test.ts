import { assert, assertEquals } from "./dev_deps.ts";
import { defaults, writeConfigFile, writeFileSec } from "./writeConfigFile.ts";

Deno.test("writeFileSec()", async (t) => {
  const testFilePath = "./foo.ts";
  const testFileContent = new TextEncoder().encode("foo");

  const afterEach = async () => {
    try {
      await Deno.remove(testFilePath, { recursive: true });
    } catch (_error) {
      console.log("Could not remove file");
    }
  };

  await t.step(
    "should write a new file if the path does not exist yet",
    async () => {
      await writeFileSec(testFilePath, testFileContent);
      const file = await Deno.readFile(testFilePath);

      assertEquals(new TextDecoder().decode(file), "foo");

      await afterEach();
    },
  );

  await t.step("should warn when file already exists", async () => {
    await Deno.writeFile(testFilePath, testFileContent);

    await writeFileSec(testFilePath, testFileContent);

    await afterEach();
  });
});

Deno.test("writeConfigFile()", async (test) => {
  const testDir = "test_directory";

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });
    Deno.chdir(testDir);
  };

  const afterEach = async () => {
    Deno.chdir("..");
    await Deno.remove(testDir, { recursive: true });
  };

  await test.step(
    "create deno.json",
    async () => {
      await beforeEach();

      await writeConfigFile(defaults);

      const configFile = await Deno.readFile(
        `${defaults.name}`,
      );

      assertEquals(defaults.name, "deno.json");
      assert(configFile);

      await afterEach();
    },
  );
});
