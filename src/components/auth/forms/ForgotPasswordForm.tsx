import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "../../../schemas/authSchema";
import Button from "../../shared/Button";
import { FormProps } from "../types";
import { toast } from "sonner";
import React, { useState } from "react";
import NewPasswordModal from "../modals/NewPasswordModal";

const ForgotPasswordForm = ({ onSuccess }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:4090/users?username=${data.username}`
      );
      if (!res.ok) throw new Error("Failed to search user.");

      const users = await res.json();
      if (users.length === 0) {
        toast.error("User not found.");
        return;
      }

      setUserId(users[0].id);
      setModalOpen(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong.");
    }
  };

  const handlePasswordSubmit = async (newPassword: string) => {
    if (!userId) return;

    try {
      const updateRes = await fetch(`http://localhost:4090/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      console.log("status:", updateRes.status);
      console.log("content-type:", updateRes.headers.get("content-type"));

      if (!updateRes.ok) return toast.error("Update Error");

      toast.success("Password updated successfully");

      onSuccess?.();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update password.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <>
      <form
        className="space-y-4"
        id="forgot-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          placeholder="Enter your username"
          {...register("username")}
          className="w-full p-3 border rounded-md"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Reset Password
        </Button>
      </form>

      <NewPasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </>
  );
};

export default React.memo(ForgotPasswordForm);
