'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { dateFormat, formatNumber } from '@/lib/data';

interface Props {
  data: Post;
  author: Author;
  userId: string;
}

const Post = ({ data, author, userId }: Props) => {
  const date = data.date;
  const currentDate = new Date();
  const formatdate = dateFormat(date, currentDate);
  const name = `${author.firstName} ${author.lastName}`;
  const router = useRouter();

  const [isLiked, setIsliked] = useState(data.likes.data.includes(userId));
  const [likesCount, setLikesCount] = useState(data.likes.count);
  const toggleLike = async () => {
    setIsliked(!isLiked);
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
      const res = await fetch(`/api/post/${data._id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) setIsliked(!isLiked);
    } else {
      setLikesCount((prev) => prev + 1);
      const res = await fetch(`/api/post/${data._id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) setIsliked(!isLiked);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          src={author.avatar || '/icons/profile.png'}
          alt='avater'
          width={70}
          height={70}
          className={styles.avater}
          onClick={()=>{
            router.push(`home/profile/${author.username}`);
          }}
        />
        <div>
          <div className={styles.names}>
            <h3>{name}</h3>
            <p>@{author.username}</p>
          </div>
          <p>{formatdate}</p>
        </div>
      </div>
      <div className={styles.body}>
        <p>{data.text}</p>
        <div className={styles.media}>
          {data.images &&
            data.images.map((image) => {
              return (
                <Image
                  className={styles.item}
                  key={image}
                  src={image}
                  alt='post'
                  width={200}
                  height={200}
                />
              );
            })}
          {data.videos &&
            data.videos.map((video) => {
              return (
                <video
                  key={video}
                  className={styles.item}
                  width='200'
                  height='200'
                  controls
                >
                  <source src={video} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              );
            })}
        </div>
      </div>
      <div className={styles.bottom}>
        <button>
          {/* <Image src="/icons/like.png" alt="like" width={30} height={30} /> */}
          <svg
            width='30'
            height='30'
            viewBox='0 0 400 400'
            fill={isLiked ? '#ff0000' : 'none'}
            onClick={toggleLike}
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M350 147.12C350 105.1 315.94 71.04 273.92 71.04C238.08 71.04 208.06 95.83 200 129.19C191.94 95.83 161.91 71.04 126.08 71.04C84.06 71.05 50 105.11 50 147.12C50 167.1 57.71 185.27 70.31 198.85L200 328.95L329.69 198.85C342.29 185.28 350 167.11 350 147.12Z'
              stroke='#000000'
              strokeWidth={isLiked ? '0' : '20'}
              strokeMiterlimit='10'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>{likesCount > 0 && formatNumber(likesCount)}</span>
        </button>
        <button>
          <Image
            src='/icons/comment.png'
            alt='comment'
            width={30}
            height={30}
          />
          <span>{data.comments.count > 0 && data.comments.count}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
