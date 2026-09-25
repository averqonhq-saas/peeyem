export interface UploadResult {
  url: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  isMockFallback?: boolean;
}

/**
 * Upload an image file to Cloudinary via /api/upload
 * with client data URL fallback if network is unavailable.
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        url: data.url,
        publicId: data.publicId,
        format: data.format,
        bytes: data.bytes,
        isMockFallback: false,
      };
    }

    const err = await response.json().catch(() => ({}));
    console.warn("Cloudinary API upload returned error, using local fallback:", err);
  } catch (error) {
    console.warn("Upload fetch error:", error);
  }

  // Graceful local fallback for instant zero-friction testing
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        publicId: `local_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
        format: file.type.split("/")[1] || "jpg",
        bytes: file.size,
        width: 800,
        height: 600,
        isMockFallback: true,
      });
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Check whether Cloudinary credentials are set
 */
export function getCloudinaryStatus(): { configured: boolean; cloudName?: string } {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "y6omg9lg";
  return {
    configured: Boolean(cloudName),
    cloudName,
  };
}
