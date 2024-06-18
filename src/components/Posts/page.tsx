
import Post from './pageClient';
import { auth, signIn } from '@/auth';

const Posts = async () => {
  // const { posts, users } = await Setup();
  // const session = await auth();
  // if (!session) return signIn();
  // const { id } = session?.user as User;
  // const page = 1;
  // const skip = (page - 1) * 10;
  // const post = (
  //   await posts?.find().skip(skip).limit(10).toArray()
  // )?.toReversed() as unknown as Post[];

  const session = await auth ()
  if (!session?.user) return signIn();
  const {id} = session?.user as User;

  return (
    <>
      <Post id={id} />
    </>
  );
};

export default Posts;
