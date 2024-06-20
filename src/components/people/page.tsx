'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { formatNumber } from '@/lib/data';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

type User = {
  id: string;
  username: string;
  avatar?: string;
  lastName: string;
  firstName: string;
  followers: string[];
  isFollowing: boolean;
};

interface Props {
  user: User;
}

const People = ({ user }: Props) => {
  const imgSrc = user.avatar || '/icons/profile.png';
  const [followers, setFollowers] = useState(user.followers.length);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const handleFollow = async () => {
    setIsLoading(true);
     const res = await fetch(`/api/user/follow/${user.id}`, {
      method: 'PUT',
    })
    if (res.ok) {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1);
    } else toast("An error occured")
    setIsLoading(false);
  };
  return (
    <div className={styles.container}>
      <Link
        className={styles.container}
        href={`/home/profile/${user.username}`}
      >
        <Image src={imgSrc} alt={user.firstName} height={70} width={70} />
      </Link>
      <div className={styles.data}>
        <h3 className='truncate'>
          {user.firstName} {user.lastName}
        </h3>
        <p>{`${formatNumber(followers)} Followers`}</p>
        {isFollowing ? (
          <p>Following</p>
        ) : (
          <button disabled={isLoading} onClick={handleFollow}>
            Follow
          </button>
        )}
      </div>
    </div>
  );
};

export default People;
