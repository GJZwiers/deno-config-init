import { Rhum } from "./dev_deps.ts";
import { replacers } from "./replacers.ts";
import { settings } from "./settings.ts";

Rhum.testPlan("replacers.ts", () => {
    Rhum.testSuite("replacers", () => {
  
      Rhum.afterEach(() => {
        settings.extension = "ts";
      });
  
      Rhum.testCase("should replace {{extension}} syntax with 'ts'", () => {
        const first = replacers[0];
  
        const str = "test {{extension}} test";
  
        const sub = str.replace(first.pattern, first.fn);
  
        Rhum.asserts.assertEquals(sub, "test ts test");
      });
  
      Rhum.testCase("should replace {{type:type}} syntax with the TypeScript type", () => {
        const second = replacers[1];
  
        const str1 = "function foo(){{type:string}}";
  
        const str2 = "function foo(){{type: string}}";
  
        const str3 = "function foo() {{type: string}}";
  
        const sub = str1.replace(second.pattern, second.fn);
  
        const sub2 = str2.replace(second.pattern, second.fn);
  
        const sub3 = str3.replace(second.pattern, second.fn);
  
        Rhum.asserts.assertEquals(sub, "function foo(): string");
  
        Rhum.asserts.assertEquals(sub2, "function foo(): string");
  
        Rhum.asserts.assertEquals(sub3, "function foo(): string");
      });

      Rhum.testCase("should remove {{type:type}} syntax if settings.extension = js", () => {
        settings.extension = "js";

        const second = replacers[1];
  
        const str1 = "function foo(){{type:string}}";

        const sub = str1.replace(second.pattern, second.fn);
  
        Rhum.asserts.assertEquals(sub, "function foo()");
      });
  
      Rhum.testCase("should keep ``ts ... ``ts syntax if settings.extension = ts", () => {
        const third = replacers[2];
  
        const str = "test ``ts\nfoo\n``ts test";
  
        const sub = str.replace(third.pattern, third.fn);
  
        Rhum.asserts.assertEquals(sub, "test foo test");
      });

      Rhum.testCase("should remove ``ts ... ``ts syntax if settings.extension = js", () => {
        settings.extension = "js";

        const third = replacers[2];
  
        const str = "test ``ts\nfoo\n``ts test";
  
        const sub = str.replace(third.pattern, third.fn);
  
        Rhum.asserts.assertEquals(sub, "test  test");
      });
  
      Rhum.testCase("should not replace TS modifiers if settings.extension = ts", () => {
        const fourth = replacers[3];
  
        const str = "{{mod:public}} foo";
  
        const sub = str.replace(fourth.pattern, fourth.fn);
  
        Rhum.asserts.assertEquals(sub, "public foo");
      });

      Rhum.testCase("should remove TS modifiers if settings.extension = js", () => {
        settings.extension = "js";

        const fourth = replacers[3];
  
        const str = "{{mod:public}} foo";
  
        const sub = str.replace(fourth.pattern, fourth.fn);
  
        Rhum.asserts.assertEquals(sub, " foo");
      });
    });
  });
  
  Rhum.run();
  