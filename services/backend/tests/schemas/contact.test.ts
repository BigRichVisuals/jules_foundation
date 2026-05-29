import { contactSchema } from "../../src/schemas/contact.js";

describe("contactSchema", () => {
  it("accepts a valid contact submission", () => {
    const parsed = contactSchema.parse({
      name: "Jane Jules",
      email: "jane@example.com",
      subject: "Volunteer",
      message: "I would like to learn more about volunteering."
    });

    expect(parsed.email).toBe("jane@example.com");
  });

  it("rejects invalid email and short messages", () => {
    const result = contactSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      subject: "Hello",
      message: "too short"
    });

    expect(result.success).toBe(false);
  });
});
