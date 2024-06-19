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
  const { users,} = await Setup();
  const user = (await users?.findOne({
    _id: new ObjectId(userSession.id),
  })) as unknown as UserPlus;
  if (!user) return signIn();
  return <Profile userSession={userSession} user={user}  />;
};

export default Page;
