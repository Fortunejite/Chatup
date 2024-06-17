import setup from '@/lib/setupdb';
import { hash } from 'bcrypt';
import { ZodError, object, string } from 'zod';
import { NextResponse } from 'next/server';
import { auth, signIn } from '@/auth';

interface Credentials {
  username: string;
  password: string;
  email: string;
}

const User = object({
  email: string().email({ message: 'Invalid email address' }),
  username: string()
    .min(3, { message: 'Username must be a minimum of 3 characters' })
    .max(20, { message: 'Username must be a maximum of 20 characters' }),
  firstName: string().min(0, 'First Name is required'),
  lastName: string().min(0, 'Last Name is required'),
  bio: string(),
  pic: string(),
});

export async function POST(request: Request) {
  try {
    const { users } = await setup();
    const session = await auth();
    if (!session)
      return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
    const { username: old } = session?.user as User;
    const { email: oldEmail } = session?.user as User;
    const credentials: UserPlus = await request.json();
    const { username, email, bio, firstName, lastName, pic } =
      User.parse(credentials);
    if (username !== old) {
      const user = await users?.findOne({ username });
      if (user)
        return NextResponse.json(
          { msg: 'Username already exists' },
          { status: 409 },
        );
    }
    if (email !== oldEmail) {
      const user = await users?.findOne({ email });
      if (user)
        return NextResponse.json(
          { msg: 'Email already exists' },
          { status: 409 },
        );
    }
    const user = await users?.updateOne(
      { username: old },
      { $set: { bio, firstName, lastName, avatar: pic, username, email } },
    );
    if (!user)
      return NextResponse.json(
        { msg: 'Profile update failed' },
        { status: 409 },
      );
    if (!user)
      return NextResponse.json(
        { msg: 'Profile update failed' },
        { status: 409 },
      );
    return NextResponse.json({ msg: 'Profile updated' }, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.issues[0].message);

      return NextResponse.json({ msg: e.issues[0].message }, { status: 409 });
    }
    console.log(e);

    return NextResponse.json({ msg: 'Profile update failed' }, { status: 409 });
  }
}