import Setup from '@/lib/setupdb';
import Post from './Post/Post';
import { ObjectId } from 'mongodb';
import { auth, signIn } from '@/auth';

const Posts = async () => {
  const { posts, users } = await Setup();
  const session = await auth();
  if (!session) return signIn();
  const { id } = session?.user as User;
  const page = 1;
  const skip = (page - 1) * 10;
  const post = (
    await posts?.find().skip(skip).limit(10).toArray()
  )?.toReversed() as unknown as Post[];
  return (
    <>
      {post.map(async (data) => {
        data._id = data._id.toString();
        const author: Author = (await users?.findOne({
          _id: new ObjectId(data.userId),
        })) as unknown as Author;
        const { username, avatar, lastName, firstName } = author;
        return (
          <Post
            key={data._id}
            data={data}
            author={{ username, avatar, lastName, firstName }}
            userId={id}
          />
        );
      })}
    </>
  );
};

export default Posts;
