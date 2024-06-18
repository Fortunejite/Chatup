import Setup from '@/lib/setupdb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try{
    const id = request.nextUrl.searchParams.get('id') || "";
    const { users } = await Setup();
    const author = await users?.findOne({
      _id: new ObjectId(id),
    }) as unknown as Author;
    const {username, avatar, lastName, firstName} = author
    return NextResponse.json({ author: {username, avatar, lastName, firstName} });
  } catch (e) {
    console.log(e);
    return NextResponse.json(new Error('An error occurred while fetching author'), {status: 500});
  }
}
