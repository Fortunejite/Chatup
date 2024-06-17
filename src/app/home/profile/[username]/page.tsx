import { auth, signIn } from '@/auth';
import Setup from '@/lib/setupdb';
import Profile from './profile';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  if (!session) return signIn();
  const userSession = session?.user as User;
  if (params.username === userSession.username) redirect('/home/profile');
  const { users, posts: PostCollection } = await Setup();
  const page = 1;
  const skip = (page - 1) * 10;
  const user = await users?.findOne({
    username: params.username,
  });
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
  const posts = (await PostCollection?.find({ userId })
    .skip(skip)
    .limit(10)
    .toArray()) as unknown as Post[];
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
      posts={posts}
    />
  );
};

export default Page;
