'use client';
import styles from './page.module.css';
import Image from 'next/image';
import Post from '@/components/Posts/Post/Post';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

interface Props {
  userSession: User;
  user: UserPlus;
  posts: Post[];
}

const Profile = ({ userSession, user, posts }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageSrc, setImageSrc] = useState(userSession.pic);
  const [username, setUsername] = useState(userSession.username);
  const [firstName, setFirstName] = useState(userSession.firstName);
  const [lastName, setLastName] = useState(userSession.lastName);
  const [email, setEmail] = useState(userSession.email);
  const [bio, setBio] = useState(user.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    setImageSrc(userSession.pic);
    setUsername(userSession.username);
    setFirstName(userSession.firstName);
    setLastName(userSession.lastName);
    setEmail(userSession.email);
    setBio(user.bio);
    return setIsEditMode(false);
  };

  const handleChangePic = () => {
    setIsButtonClicked((prev) => !prev);
    inputRef.current?.click();
  };
  const handleEditSaveClick = async () => {
    if (!isEditMode) return setIsEditMode(true);
    setIsLoading(true);
    if (username.length < 3)
      return toast.warning('Username must contain atleast 3 characters');
    if (firstName.length === 0)
      return toast.warning('First name cannot be empty');
    if (lastName.length === 0)
      return toast.warning('Last name cannot be empty');
    if (email.length === 0) return toast.warning('Email cannot be empty');
    const toaster = toast.loading('Updating profile, Please wait.');
    let img = '';
    if (imageSrc != userSession.pic) {
      const formData = new FormData();
      if (imgFile) console.log(imgFile);

      if (imgFile) formData.append('image', imgFile);
      const resImage = await fetch('/api/user/upload', {
        method: 'POST',
        body: formData,
      });
      if (!resImage?.ok) {
        setIsLoading(false);
        toast.dismiss(toaster);
        return toast.error('Failed to upload Profile Picture');
      }
      img = (await resImage.json()).url;
    }
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        bio,
        pic: img,
      }),
    });
    if (res.ok) {
      toast.dismiss(toaster);
      toast.success('Profile updated');
      signOut();
      setIsLoading(false);
      return setIsEditMode(false);
    } else {
      toast.dismiss(toaster);
      const {msg} = await res.json()
      toast(msg);
      setIsLoading(false);
      return;
    }
  };
  return (
    <div className={styles.container}>
      <button
        className={styles.edit}
        disabled={isLoading}
        onClick={handleEditSaveClick}
      >
        {!isEditMode ? 'Edit' : 'Save'}
      </button>
      {isEditMode && (
        <button
          className={styles.cancel}
          disabled={isLoading}
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
      <section className={styles.hero}>
        <Image src={imageSrc} alt='Avater' width={100} height={100} />
        {isEditMode && (
          <button onClick={handleChangePic} className={styles.changePicButton}>
            Change profile picture
            <input
              type='file'
              accept='image/*'
              placeholder='Add a picture'
              onChange={(e) => {
                if (e.target.files) {
                  setImgFile(e.target.files[0]);
                  setImageSrc(URL.createObjectURL(e.target.files[0]));
                }
              }}
              ref={inputRef}
              style={{ display: 'none' }}
            />
          </button>
        )}

        {!isEditMode && <h1>{`${user.firstName} ${user.lastName}`}</h1>}
        {isEditMode && (
          <div className={styles.names}>
            <input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        )}
        {!isEditMode && <h2>@{user.username}</h2>}
        {isEditMode && (
          <div className={styles.username}>
            <span>@</span>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
          </div>
        )}
      </section>

      <section className={styles.email}>
        <h3>Email: </h3>
        {!isEditMode && <p>{user.email}</p>}
        {isEditMode && (
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </section>

      {(user.bio.length !== 0 || isEditMode) && (
        <section className={styles.bio}>
          <h3>Bio</h3>
          {!isEditMode && <p>{user.bio}</p>}
          {isEditMode && (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          )}
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
      {user.friendRequest.length > 0 && (
        <section className={styles.friendRequests}></section>
      )}
      {user.friends.length > 0 && (
        <section className={styles.friends}></section>
      )}
      <section className={styles.posts}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              author={userSession}
              data={post}
              userId={userSession.id}
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
