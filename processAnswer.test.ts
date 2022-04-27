import { processAnswer } from "./promptUserInputs.ts";
import { assertEquals } from "./dev_deps.ts";

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
