import { auth, signIn } from '@/auth';
import styles from './page.module.css';
import Image from 'next/image';
import Setup from '@/lib/setupdb';
import { ObjectId } from 'mongodb';
import Post from '@/components/Posts/Post/Post';
import Profile from './profile';

const Page = async () => {
  const session = await auth();
  if (!session) return signIn();
  const userSession = session?.user as User;
  const { users, posts: PostCollection } = await Setup();
  const page = 1;
  const skip = (page - 1) * 10;
  const user = (await users?.findOne({
    _id: new ObjectId(userSession.id),
  })) as unknown as UserPlus;
  const posts = (await PostCollection?.find({ userId: userSession.id })
    .skip(skip)
    .limit(10)
    .toArray()) as unknown as Post[];
  if (!user) return signIn();
  return <Profile userSession={userSession} user={user} posts={posts} />;
};

export default Page;
