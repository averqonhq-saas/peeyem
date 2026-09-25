import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "y6omg9lg";
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "653383149221331";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "NVcc72zu1ZMRAGgn-_ftWy-4DYk";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Try direct unsigned upload preset first
    const unsignedForm = new FormData();
    unsignedForm.append("file", base64Data);
    unsignedForm.append("upload_preset", uploadPreset);

    let res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: unsignedForm,
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        url: data.secure_url || data.url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes,
      });
    }

    // If unsigned preset is rejected (signed mode), compute Cloudinary SHA-1 signature
    const timestamp = Math.round(Date.now() / 1000);
    const crypto = await import("crypto");
    // String to sign: "timestamp=XXX" + apiSecret
    const strToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    const signedForm = new FormData();
    signedForm.append("file", base64Data);
    signedForm.append("api_key", apiKey);
    signedForm.append("timestamp", timestamp.toString());
    signedForm.append("signature", signature);

    const signedRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: signedForm,
    });

    if (!signedRes.ok) {
      const errData = await signedRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error?.message || "Failed to upload to Cloudinary" },
        { status: 500 }
      );
    }

    const signedData = await signedRes.json();
    return NextResponse.json({
      url: signedData.secure_url || signedData.url,
      publicId: signedData.public_id,
      format: signedData.format,
      bytes: signedData.bytes,
    });
  } catch (err: any) {
    console.error("API upload error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
