import { SecretViewer } from "@/components/features/secrets/secret-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Secret - SecureShare",
  description: "View a secure secret message",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SecretPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <SecretViewer secretId={id} />
    </div>
  );
}
