import { addClientSchema } from "../../../src/schemas/clientSchema";

describe("addClientSchema", () => {
  const validData = {
    name: "Alice",
    company: "Acme Inc.",
    age: "30",
    gender: "female",
    currency: "USD",
    subscriptionCost: "19.99",
  };

  it("passes with valid input and coerces values", () => {
    const parsed = addClientSchema.parse(validData);

    expect(parsed.age).toBe(30);
    expect(parsed.subscriptionCost).toBe(19.99);
    expect(parsed.gender).toBe("female");
  });

  it("fails if name is empty", () => {
    const result = addClientSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().name?._errors).toContain("Name is required");
    }
  });

  it("fails if age is too high", () => {
    const result = addClientSchema.safeParse({ ...validData, age: 150 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().age?._errors).toContain(
        "Hey, that's not possible!"
      );
    }
  });

  it("fails if subscriptionCost is zero", () => {
    const result = addClientSchema.safeParse({
      ...validData,
      subscriptionCost: 0,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().subscriptionCost?._errors).toContain(
        "Must be greater than 0"
      );
    }
  });

  it("allows optional id and picture", () => {
    const result = addClientSchema.parse({
      ...validData,
      id: "abc123",
      picture: "http://example.com/image.png",
    });

    expect(result.id).toBe("abc123");
    expect(result.picture).toBe("http://example.com/image.png");
  });
});
