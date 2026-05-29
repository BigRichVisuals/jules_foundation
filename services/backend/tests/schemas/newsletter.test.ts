import { newsletterSchema } from "../../src/schemas/newsletter.js";

describe("newsletterSchema", () => {
  it("accepts a valid subscription", () => {
    expect(newsletterSchema.parse({ email: "reader@example.com" }).email).toBe("reader@example.com");
  });

  it("rejects invalid email addresses", () => {
    expect(newsletterSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});
