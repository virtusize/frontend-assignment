import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../../schemas/authSchema";
import Button from "../../shared/Button";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { FormProps } from "../types";

const LoginForm = ({ onSuccess }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [loginError, setLoginError] = useState("");
  const { login } = useAuthStore();
  const watchedUsername = watch("username");
  const watchedPassword = watch("password");

  useEffect(() => {
    if (loginError) {
      setLoginError("");
    }
  }, [watchedUsername, watchedPassword]);

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");

    try {
      const res = await fetch(
        `http://localhost:4090/users?username=${data.username}&password=${data.password}`
      );

      if (!res.ok) {
        throw new Error("Server responded with error");
      }

      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];
        login(user);
        onSuccess();
      } else {
        setLoginError("Invalid username or password.");
      }
    } catch (err) {
      setLoginError("Server error. Please try again later.");
      console.error("Login request failed:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      id="login-form"
    >
      <p className="text-sm text-red-600 text-center">{loginError ?? ""}</p>

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

      <Button type="submit" loading={isSubmitting} className="w-full">
        Login
      </Button>
    </form>
  );
};

export default React.memo(LoginForm);
