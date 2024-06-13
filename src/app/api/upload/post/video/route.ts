import { uploadFile } from "@/lib/firebase"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const videos = await request.formData() as unknown as File[]
  let videosUrlPromise: Promise<string>[] = []
  videos?.forEach(async (video) => {
    const url = uploadFile({ file: video, path: 'posts/video' });
    videosUrlPromise.push(url);
  })
  const videosUrl = await Promise.all(videosUrlPromise)
  
  return NextResponse.json({url: videosUrl})
}