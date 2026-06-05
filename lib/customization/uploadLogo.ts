const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export interface UploadedLogoFile {
  url: string;
  filename: string;
  id?: string;
}

export async function uploadCustomizationLogo(
  file: File
): Promise<UploadedLogoFile> {
  const formData = new FormData();
  formData.append("files", file);

  const headers: Record<string, string> = {};
  if (MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = MEDUSA_PUBLISHABLE_KEY;
  }

  const response = await fetch(`${MEDUSA_BACKEND_URL}/store/customization/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Failed to upload logo"
    );
  }

  const data = (await response.json()) as {
    files?: Array<{ url?: string; id?: string; filename?: string }>;
  };

  const uploaded = data.files?.[0];
  if (!uploaded?.url) {
    throw new Error("Upload succeeded but no file URL was returned");
  }

  return {
    url: uploaded.url,
    filename: uploaded.filename ?? file.name,
    id: uploaded.id,
  };
}
