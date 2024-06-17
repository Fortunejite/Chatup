import { NextResponse } from 'next/server';
import Setup from '@/lib/setupdb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { posts } = await Setup();
  const post: Post = (await posts?.findOne({
    _id: new ObjectId(id),
  })) as unknown as Post;
  if (!post) return NextResponse.json({ msg: 'Not Found' }, { status: 404 });
  const { userId } = await request.json();
  await posts?.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        likes: {
          count: --post.likes.count,
          data: post.likes.data.filter((id) => id != userId),
        },
      },
    },
  );
  return NextResponse.json({ msg: 'Unliked' });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { posts } = await Setup();
  const post: Post = (await posts?.findOne({
    _id: new ObjectId(id),
  })) as unknown as Post;
  if (!post) return NextResponse.json({ msg: 'Not Found' }, { status: 404 });
  
  const { userId } = await request.json();
  if (post.likes.data.includes(userId))  return NextResponse.json({ msg: 'Not Found' }, { status: 404 });
  post.likes.data.push(userId);
  await posts?.updateOne(
    { _id: new ObjectId(id) },
    { $set: { likes: { count: ++post.likes.count, data: post.likes.data } } },
  );
  return NextResponse.json({ msg: 'Liked' });
}
