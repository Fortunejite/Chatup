'use client';
import styles from '../page.module.css';
import Image from 'next/image';
import Post from '@/components/Posts/Post/Post';
import { toast } from 'react-toastify';

interface Props {
  user: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
    email: string;
    followers: string[];
    following: string[];
  };
  posts: Post[];
  userId: string;
}

const Profile = ({  user, posts, userId }: Props) => {
  const img = user.avatar || '/icons/profile.png';
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <Image src={img} alt='Avater' width={100} height={100} />
        <h1>{`${user.firstName} ${user.lastName}`}</h1>
        <h2>@{user.username}</h2>
      </section>

      <section className={styles.email}>
        <h3>Email: </h3>
        <p>{user.email}</p>
      </section>

      {user.bio.length !== 0 && (
        <section className={styles.bio}>
          <h3>Bio</h3>
          <p>{user.bio}</p>
        </section>
      )}
      <section className={styles.follows}>
        <div>
          <h3>Followers</h3>
          <p>{user.followers.length}</p>
        </div>
        <div>
          <h3>Following</h3>
          <p>{user.following.length}</p>
        </div>
      </section>
      <section className={styles.posts}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              author={user as unknown as Author}
              data={post}
              userId={userId}
            />
          ))
        ) : (
          <h1>No posts yet</h1>
        )}
      </section>
    </div>
  );
};

export default Profile;
