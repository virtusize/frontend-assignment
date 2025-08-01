import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../../../schemas/authSchema";
import Button from "../../shared/Button";
import { FormProps } from "../types";
import React from "react";
import { toast } from "sonner";

const RegisterForm = ({ onSuccess }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch(
        `http://localhost:4090/users?username=${data.username}`
      );
      if (!res.ok) throw new Error("Failed to check username");

      const existingUsers = await res.json();
      if (existingUsers.length > 0) {
        toast.error("Username already taken.");
        return;
      }

      const createRes = await fetch("http://localhost:4090/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (createRes.ok) {
        onSuccess();
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
      console.error("Registration error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      id="register-form"
    >
      {errors.username && (
        <p className="text-sm text-red-500">{errors.username.message}</p>
      )}

      <input
        placeholder="Username"
        {...register("username")}
        className="w-full p-3 border rounded-md"
      />
      {errors.username && (
        <p className="text-sm text-red-500">{errors.username.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="w-full p-3 border rounded-md"
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword")}
        className="w-full p-3 border rounded-md"
      />
      {errors.confirmPassword && (
        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Register
      </Button>
    </form>
  );
};

export default React.memo(RegisterForm);
