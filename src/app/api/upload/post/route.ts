import { auth } from "@/auth"
import Setup from "@/lib/setupdb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const text = formData.get("post") as string
  const images = JSON.parse(formData.get("images") as string)
  const videos = JSON.parse(formData.get("videos") as string)
  const date = new Date()
  const session = await auth()
  const user = session?.user as User
  const postData = {
    text,
    images,
    videos,
    date,
    userId: user.id,
    likes: {
      count: 0,
      data: []
    },
    comments: {
      count: 0,
      data: []
    }
  }
  const {posts} = await Setup()
  await posts?.insertOne(postData)
  return NextResponse.json({msg: 'success'}, {status: 201})
}