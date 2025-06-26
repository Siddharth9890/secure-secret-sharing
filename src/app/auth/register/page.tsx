import { RegisterForm } from "@/components/features/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - SecureShare",
  description: "Create a new SecureShare account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
