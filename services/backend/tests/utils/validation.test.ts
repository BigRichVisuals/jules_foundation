import { z } from "zod";
import { validateBody } from "../../src/utils/validation.js";

describe("validateBody", () => {
  const schema = z.object({ value: z.string().min(1) });

  it("parses valid JSON through a schema", () => {
    expect(validateBody(schema, JSON.stringify({ value: "ok" }))).toEqual({ value: "ok" });
  });

  it("throws a validation error when JSON is malformed", () => {
    expect(() => validateBody(schema, "{")).toThrow("Request body must be valid JSON.");
  });

  it("throws a validation error when required fields are missing", () => {
    expect(() => validateBody(schema, JSON.stringify({}))).toThrow("Request body failed validation.");
  });
});
