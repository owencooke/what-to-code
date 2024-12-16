import { supabase } from "@/app/(server)/integration/supabase/config";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  const uploadPromises = files.map(async (file) => {
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${params.id}/images/${file.name}`, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    return data;
  });

  const results = await Promise.all(uploadPromises);
  const successfulUploads = results.filter(Boolean);

  if (successfulUploads.length === 0) {
    return NextResponse.json(
      { message: "No files were successfully uploaded." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: `Successfully uploaded ${successfulUploads.length} out of ${files.length} files`,
    uploadedFiles: successfulUploads,
  });
}
