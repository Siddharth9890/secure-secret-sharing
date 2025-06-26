import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateSecretForm } from "@/components/features/secrets/create-secret-form";
import { Box } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Secret - SecureShare",
  description: "Create a new secure secret",
};

export default async function CreateSecretPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Box sx={{ p: 2 }}></Box>

      <CreateSecretForm />
      <Box sx={{ p: 2 }}></Box>
    </div>
  );
}
