import { auth, signIn } from '@/auth';
import Setup from '@/lib/setupdb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  
  const id = params.id
  
  const { users: userCollection } = await Setup();
  const session = await auth();
  const userSession = session?.user as User;
  const msg = `${userSession?.username} started following you.`;
  const date = new Date();

  if (!userSession) {
    return signIn();
  }

  
  const userSessionId = userSession.id || '';

  try {
    await userCollection?.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $push: {
          followers: userSessionId,
          notifications: {
            msg,
            type: 'followed',
            avater: userSession.pic,
            date,
          },
        } as any,
      },
    );
    await userCollection?.updateOne(
      {
        _id: new ObjectId(userSessionId),
      },
      { $push: { following: id } as any },
    );
    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
