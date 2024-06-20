import Setup from "@/lib/setupdb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const skip = Number(request.nextUrl.searchParams.get('skip'))
  const limit = Number(request.nextUrl.searchParams.get('limit'))
  const { posts, users } = await Setup();
  const post = await posts?.find().skip(skip).limit(limit).toArray() as unknown as Post[];
  // let authors: { [id: string]: Author }={}
  const obj = post.map((data) => {
    const author = users?.findOne({
      _id: new ObjectId(data.userId),
    })
    return author as unknown as Promise<Author>;
  })
  const authors = await Promise.all(obj)
  const res = post.map((data) => {
    authors.map((author) => {
      if (data.userId == author._id?.toString()) {
        const { username, avatar, lastName, firstName } = author
        data.author = { username, avatar, lastName, firstName }
      }
    })
    return data
  })
  return NextResponse.json({posts: res})
}