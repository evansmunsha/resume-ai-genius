import { Template } from "@/components/templates/registry";
import { put } from "@vercel/blob";
import { env } from "@/env";

export async function generateAndUploadPreview(template: Template, previewDataUrl: string) {
  try {
    // Convert data URL to Blob
    const response = await fetch(previewDataUrl);
    const blob = await response.blob();

    // Upload to Vercel Blob
    const { url } = await put(
      `previews/${template.id}.jpg`, 
      blob, 
      { access: 'public', addRandomSuffix: false }
    );

    return url;
  } catch (error) {
    console.error("Failed to upload preview:", error);
    return null;
  }
} 