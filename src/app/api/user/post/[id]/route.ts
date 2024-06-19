import Setup from "@/lib/setupdb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const skip = Number(request.nextUrl.searchParams.get('skip'))
  const limit = Number(request.nextUrl.searchParams.get('limit'))
  const { posts } = await Setup();
  const data = await posts?.find({ userId: params.id })
  .skip(skip)
  .limit(limit)
  .toArray()
  return NextResponse.json({data})
}