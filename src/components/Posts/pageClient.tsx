'use client';
import Setup from '@/lib/setupdb';
import Post from './Post/Post';
import { ObjectId } from 'mongodb';
// import { auth, signIn } from '@/auth';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { fetchPosts } from '@/lib/fetchPosts';
import Loader from '../Loader/page';

const Posts = ({ id }: { id: string }) => {
  // const { posts, users } = await Setup();
  // const session = await auth();
  // if (!session) return signIn();
  // const { id } = session?.user as User;
  // const page = 1;
  // const skip = (page - 1) * 10;
  // const post = (
  //   await posts?.find().skip(skip).limit(10).toArray()
  // )?.toReversed() as unknown as Post[];

  const [post, setPost] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const fetchDataOnMount = async () => {
      // setIsLoading(true);
      const { posts: initialData } = await fetchPosts();
      setPost(initialData);
      setHasMore(initialData.length === 10); // Check if there are more items after first fetch
      // setIsLoading(false);
    };

    fetchDataOnMount();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        loadMoreData();
      }
    });

    const loadMoreData = async () => {
      setIsLoading(true);
      const nextSkip = post.length;
      const { posts: newData } = await fetchPosts(nextSkip);
      setPost((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length === 10); // Check if there are more items after loading next chunk
      setIsLoading(false);
    };

    if (hasMore) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (lastItemRef.current) {
        observer.observe(lastItemRef.current);
      }

      return () => observer.disconnect(); // Cleanup on unmount
    }
  }, [post, hasMore]);

  // if (!session?.user) return signIn();

  return (
    <>
      {post.map((data) => {
        const author = data.author; // Store author data in a variable
        if (data) {
          data.date = new Date(data.date);
          return (
            <>
              <Post
                key={data._id}
                data={data}
                author={author} // Provide default values if author is undefined
                userId={id}
              />
              <div ref={lastItemRef}></div>
            </>
          );
        } else return null;
      })}
      {isLoading && <Loader />}
    </>
  );
};

export default Posts;
