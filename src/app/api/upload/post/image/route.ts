import { uploadFile } from "@/lib/firebase"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const images = await request.formData() as unknown as File[]
  
  
  let imagesUrlPromise: Promise<string>[] = []
  images?.forEach(async (image) => {
    const url = uploadFile({ file: image, path: 'posts/image' });
    imagesUrlPromise.push(url);
  })
  const imagesUrl = await Promise.all(imagesUrlPromise)
  
  return NextResponse.json({url: imagesUrl})
}