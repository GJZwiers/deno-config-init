import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.166.0/testing/asserts.ts";
import {
  assertSnapshot,
} from "https://deno.land/std@0.166.0/testing/snapshot.ts";
import { Options } from "./types.ts";
import {
  defaultOptions,
  inputHandler,
  process,
  processAnswer,
  promptUserInputs,
  writeConfigFile,
  writeFileSec,
} from "./writeConfigFile.ts";

Deno.test("writeConfigFile", async (context) => {
  const testDir = "test_directory";
  let testOpts: Options;

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });

    Deno.chdir(testDir);
    testOpts = self.structuredClone(defaultOptions);
  };

  const afterEach = async () => {
    Deno.chdir("..");

    await Deno.remove(testDir, { recursive: true });
  };

  const test = async (
    options: Deno.TestDefinition,
  ) => {
    await beforeEach();

    await context.step(options);

    await afterEach();
  };

  await test({
    name: "throws if config file extension is not .json or .jsonc",
    fn: () => {
      testOpts.name = "deno.yaml";
      assertRejects(async () => {
        await writeConfigFile({}, testOpts);
      });
    },
  });

  await test({
    name: "creates deno.json",
    fn: async () => {
      const output = await inputHandler(defaultOptions);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");
      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates fmt options",
    only: true,
    fn: async () => {
      testOpts.fmt = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assertEquals(testOpts.name, "deno.json");
      assert(bytes.length > 0);

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates filled deno.jsonc if --fill is used",
    fn: async () => {
      testOpts.fill = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name:
      "creates filled deno.jsonc with a specific section only if --fill is used together with another option",
    fn: async () => {
      testOpts.fmt = true;
      testOpts.fill = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.jsonc");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates lint options",
    fn: async () => {
      testOpts.lint = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );
      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates compilerOptions",
    fn: async () => {
      testOpts.tsconfig = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates tasks",
    fn: async () => {
      testOpts.task = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates importMap",
    fn: async () => {
      testOpts.map = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "creates all if yes option is true",
    fn: async () => {
      testOpts.yes = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "can set a custom file name if yes option is true",
    fn: async () => {
      testOpts.yes = true;
      testOpts.name = "config.json";

      await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
    },
  });

  await test({
    name: "create test",
    fn: async () => {
      testOpts.test = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create bench",
    fn: async () => {
      testOpts.bench = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "create lock as boolean",
    fn: async () => {
      testOpts.lock = true;

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "set lockFile to create lock as string",
    fn: async () => {
      testOpts.lockfile = "deno-lock.json";

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });

  await test({
    name: "set lockFile to create lock as string",
    fn: async () => {
      testOpts.lockfile = "deno.lock";

      const output = await inputHandler(testOpts);

      const bytes = await Deno.readFile(
        `${testOpts.name}`,
      );

      assert(bytes.length > 0);
      assertEquals(testOpts.name, "deno.json");

      await assertSnapshot(context, output.split("\n"));
    },
  });
});

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

  await t.step(
    "should write a new file if the path exists and the force option is used",
    async () => {
      await writeFileSec(testFilePath, testFileContent);

      const file = await Deno.readFile(testFilePath);
      assertEquals(new TextDecoder().decode(file), "foo");

      await writeFileSec(testFilePath, new TextEncoder().encode("bar"), {
        force: true,
      });

      const overwrittenFile = await Deno.readFile(testFilePath);
      assertEquals(new TextDecoder().decode(overwrittenFile), "bar");

      await afterEach();
    },
  );
});

Deno.test("returns choices collected from user prompts", () => {
  const choices = promptUserInputs({ testmode: true });

  assertEquals(choices, {
    tsconfig: true,
    lint: true,
    fmt: true,
    task: true,
    test: true,
    importMap: false,
    name: "deno.json",
  });
});

Deno.test("processOptions", async (context) => {
  const testDir = "test_directory";
  let testOpts: Options;

  const beforeEach = async () => {
    await Deno.mkdir(testDir, { recursive: true });

    Deno.chdir(testDir);
    testOpts = self.structuredClone(defaultOptions);
  };

  const afterEach = async () => {
    Deno.chdir("..");

    await Deno.remove(testDir, { recursive: true });
  };

  const test = async (
    options: Deno.TestDefinition,
  ) => {
    await beforeEach();

    await context.step(options);

    await afterEach();
  };

  await test({
    name: "throw if --yes is used with --fmt",
    fn: () => {
      testOpts.yes = true;
      testOpts.fmt = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --lint",
    fn: () => {
      testOpts.yes = true;
      testOpts.lint = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --task",
    fn: () => {
      testOpts.yes = true;
      testOpts.task = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --tsconfig",
    fn: () => {
      testOpts.yes = true;
      testOpts.tsconfig = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --map",
    fn: () => {
      testOpts.yes = true;
      testOpts.map = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --bench",
    fn: () => {
      testOpts.yes = true;
      testOpts.bench = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --lock",
    fn: () => {
      testOpts.yes = true;
      testOpts.lock = true;

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "throw if --yes is used with --lockfile",
    fn: () => {
      testOpts.yes = true;
      testOpts.lockfile = "deno_lock.json";

      assertThrows(() => {
        process(testOpts);
      });
    },
  });

  await test({
    name: "Returns object with map: true if --map option is true",
    fn: () => {
      testOpts.map = true;

      const expected: Options = { ...defaultOptions, map: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with map: true if --task option is true",
    fn: () => {
      testOpts.task = true;

      const expected: Options = { ...defaultOptions, task: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with jsonc: true if --jsonc option is true",
    fn: () => {
      testOpts.jsonc = true;

      const expected: Options = { ...defaultOptions, jsonc: true };

      assertEquals(process(testOpts), expected);
    },
  });

  await test({
    name: "Returns object with tsconfig: true if --tsconfig option is true",
    fn: () => {
      testOpts.tsconfig = true;

      const expected: Options = { ...defaultOptions, tsconfig: true };

      assertEquals(process(testOpts), expected);
    },
  });
});

Deno.test("returns default value if no answer is provided", () => {
  const answer = processAnswer(null, true);
  assertEquals(answer, true);
});

Deno.test("returns true if answer is yes", () => {
  const yes = processAnswer("yes", true);
  assertEquals(yes, true);
  const y = processAnswer("y", true);
  assertEquals(y, true);
  const Y = processAnswer("Y", true);
  assertEquals(Y, true);
});

Deno.test("returns false if answer is no", () => {
  const no = processAnswer("no", false);
  assertEquals(no, false);
  const n = processAnswer("n", false);
  assertEquals(n, false);
  const N = processAnswer("N", false);
  assertEquals(N, false);
});

Deno.test("returns default value if other answer is provided", () => {
  const answer = processAnswer("foo", true);
  assertEquals(answer, true);
});
