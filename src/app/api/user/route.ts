import { auth } from '@/auth';
import Setup from '@/lib/setupdb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const skip = Number(request.nextUrl.searchParams.get('skip'));
  const limit = Number(request.nextUrl.searchParams.get('limit'));
  const session = await auth();
  const user = session?.user;
  const { users: userCollecton } = await Setup();
  const users = await userCollecton
    ?.find({
      _id: {
        $not: {
          $eq: new ObjectId(user?.id),
        },
      },
      followers: {
        $not: { $in: [user?.id?.toString()] },
      },
    })
    .skip(skip)
    .limit(limit)
    .toArray();
  return NextResponse.json({ data: users });
}
