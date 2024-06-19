import { auth, signIn } from '@/auth';
import Setup from '@/lib/setupdb';
import Profile from './profile';
import { redirect, notFound } from 'next/navigation';

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) return signIn();
  const userSession = session?.user as User;
  if (params.username === userSession.username) redirect('/home/profile');
  const { users } = await Setup();
  const user = await users?.findOne({
    username: params.username,
  });
  if(!user) return notFound()
  const userId = user?._id.toString() as string;
  const {
    username,
    firstName,
    lastName,
    bio,
    email,
    followers,
    following,
  }: UserPlus = user as unknown as UserPlus;
  if (!userSession) return signIn();
  return (
    <Profile
      user={{
        username,
        firstName,
        lastName,
        avatar: user?.avatar,
        bio,
        email,
        followers,
        following,
      }}
      userId={userId}
    />
  );
};

export default Page;
