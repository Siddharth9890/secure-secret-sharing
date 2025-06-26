import { SecretViewer } from "@/components/features/secrets/secret-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Secret - SecureShare",
  description: "View a secure secret message",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function SecretPage({ params }: PageProps) {
  return (
    <div>
      <SecretViewer secretId={params.id} />
    </div>
  );
}
