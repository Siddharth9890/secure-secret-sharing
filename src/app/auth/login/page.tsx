import { LoginForm } from "@/components/features/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SecureShare",
  description: "Sign in to your SecureShare account",
};

export default function LoginPage() {
  return <LoginForm />;
}
