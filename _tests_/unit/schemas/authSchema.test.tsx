import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  newPasswordSchema,
} from "../../../src/schemas/authSchema";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("passes with valid data", () => {
      expect(() =>
        loginSchema.parse({ username: "testuser", password: "secret" })
      ).not.toThrow();
    });
    it("fails if username is missing (undefined)", () => {
      const result = loginSchema.safeParse({ password: "secret" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().username?._errors).toContainEqual(
          expect.stringContaining("expected string")
        );
      }
    });
    it("fails if username is empty string", () => {
      const result = loginSchema.safeParse({
        username: "",
        password: "secret",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().username?._errors).toContain(
          "Username is required"
        );
      }
    });
    it("fails if password is too short", () => {
      const result = loginSchema.safeParse({
        username: "user",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().password?._errors).toContain(
          "Password must be at least 4 characters"
        );
      }
    });
  });

  describe("registerSchema", () => {
    const valid = {
      username: "user",
      password: "secret",
      confirmPassword: "secret",
    };

    it("passes with matching passwords", () => {
      expect(() => registerSchema.parse(valid)).not.toThrow();
    });

    it("fails if username too short", () => {
      const result = registerSchema.safeParse({
        ...valid,
        username: "ab",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().username?._errors).toContain(
          "Username must be at least 3 characters"
        );
      }
    });

    it("fails if passwords don't match", () => {
      const result = registerSchema.safeParse({
        ...valid,
        confirmPassword: "wrong",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().confirmPassword?._errors).toContain(
          "Passwords do not match"
        );
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("passes with valid username", () => {
      expect(() =>
        forgotPasswordSchema.parse({ username: "testuser" })
      ).not.toThrow();
    });

    it("fails if username is missing (undefined)", () => {
      const result = loginSchema.safeParse({ password: "secret" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().username?._errors).toContainEqual(
          expect.stringContaining("expected string")
        );
      }
    });
    it("fails if username is empty string", () => {
      const result = loginSchema.safeParse({
        username: "",
        password: "secret",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().username?._errors).toContain(
          "Username is required"
        );
      }
    });
  });

  describe("newPasswordSchema", () => {
    it("passes with valid password", () => {
      expect(() =>
        newPasswordSchema.parse({ password: "strongpass" })
      ).not.toThrow();
    });

    it("fails if password is too short", () => {
      const result = newPasswordSchema.safeParse({ password: "123" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().password?._errors).toContain(
          "Password must be at least 4 characters"
        );
      }
    });

    it("fails if password is too long", () => {
      const longPassword = "a".repeat(51);
      const result = newPasswordSchema.safeParse({ password: longPassword });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().password?._errors).toContain(
          "Password too long"
        );
      }
    });
  });
});
