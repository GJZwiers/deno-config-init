import { promptUserInputs } from "./promptUserInputs.ts";
import { assertEquals } from "./dev_deps.ts";

Deno.test("returns choices collected from user prompts", () => {
  const choices = promptUserInputs({ testmode: true });

  assertEquals(choices, {
    tsconfig: true,
    lint: true,
    fmt: true,
    task: true,
    importMap: false,
    name: "deno.json",
  });
});
