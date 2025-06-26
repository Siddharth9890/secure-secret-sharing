import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SecretsList } from "@/components/features/secrets/secrets-list";
import { DashboardHeader } from "@/components/features/dashboard/dashboard-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SecureShare",
  description: "Manage your secure secrets",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <DashboardHeader user={session.user} />
      <SecretsList />
    </div>
  );
}
