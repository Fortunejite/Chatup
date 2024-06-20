'use client';
import { ChangeEvent, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';

const UploadTop = () => {
  const [post, setPost] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isImageClicked, setIsImageClicked] = useState(false);
  const [isVideoClicked, setIsVideoClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (images.length + videos.length >= 4)
      return toast('Maximum of 4 media to upload');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        setImages((prev) => [...prev, file]);
      }
    }
  };
  const addVideo = (e: ChangeEvent<HTMLInputElement>) => {
    if (images.length + videos.length >= 5) return;
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setVideos((prev) => [...prev, file]);
      }
    }
  };

  const handleImageClick = () => {
    setIsImageClicked((prev) => !prev); // Simulate click by toggling state
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoClick = () => {
    setIsVideoClicked((prev) => !prev); // Simulate click by toggling state
  };

  const handleUpload = async () => {
    if (post === '' && images.length === 0 && videos.length === 0)
      return toast('Nothing to upload');
    setIsLoading(true);
    const toaster = toast.loading('Uploading post, Please wait.');
    const formDataImage = new FormData();
    const formDataVideo = new FormData();
    let imagePromise: Promise<Response> | null = null;
    let videoPromie: Promise<Response> | null = null;
    let resImage: Response | null = null;
    let resVideo: Response | null = null;
    try {
      if (images) {
        images.forEach((image) => {
          formDataImage.append('images', image);
        });
        imagePromise = fetch('/api/upload/post/image', {
          method: 'POST',
          body: formDataImage,
        });
      }
      if (videos) {
        videos.forEach((video) => {
          formDataVideo.append('videos', video);
        });
        videoPromie = fetch('/api/upload/post/video', {
          method: 'POST',
          body: formDataVideo,
        });
      }
      if (imagePromise && videoPromie) {
        const res = await Promise.all([imagePromise, videoPromie]);
        resImage = res[0];
        resVideo = res[1];
      } else {
        resImage = imagePromise ? await imagePromise : null;
        resVideo = videoPromie ? await videoPromie : null;
      }
      if (!resImage?.ok && !resVideo?.ok) {
        setIsLoading(false);
        return toast.update(toaster, {
          render: 'Failed to upload post',
          type: 'error',
          isLoading: false,
        });
      }

      const imageArray = resImage
        ? JSON.stringify((await resImage.json()).url)
        : '[]';
      const videoArray = resVideo
        ? JSON.stringify((await resVideo.json()).url)
        : '[]';
      const postData = new FormData();
      postData.append('post', post);
      postData.append('images', imageArray);
      postData.append('videos', videoArray);
      const res = await fetch('/api/upload/post', {
        method: 'POST',
        body: postData,
      });
      if (!res.ok) {
        setIsLoading(false);
        return toast.update(toaster, {
          render: 'Failed to upload post',
          type: 'error',
          isLoading: false,
        });
      }
      setPost('');
      setImages([]);
      setVideos([]);
      toast.dismiss(toaster);
      return toast('Uploaded successfully', { type: 'success' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.upload}>
      <div className={styles.upload__top}>
        <button onClick={handleUpload} disabled={isLoading}>
          <div className={styles.imgContainer}>
            <Image
              className={styles.img}
              src='/icons/edit-2.png'
              alt='Upload Post'
              width={20}
              height={20}
            />
          </div>
          <span>Upload post</span>
        </button>
        <button onClick={handleImageClick} disabled={isLoading}>
          <div className={styles.imgContainer}>
            <Image
              className={styles.img}
              src='/icons/gallery-add.png'
              alt='Upload photo'
              width={20}
              height={20}
            />
            <input
              type='file'
              accept='image/*'
              placeholder='Add a picture'
              onChange={(e) => addImage(e)}
              ref={(input) => {
                if (isImageClicked) {
                  input?.click(); // Trigger actual click when state is true
                }
              }}
            />
          </div>
          <span>Add photo</span>
        </button>
        <button onClick={handleVideoClick} disabled={isLoading}>
          <div className={styles.imgContainer}>
            <Image
              className={styles.img}
              src='/icons/video-circle.png'
              alt='Upload video'
              width={20}
              height={20}
            />
            <input
              type='file'
              id='file'
              name='file'
              accept='video/*'
              placeholder='Add video'
              onChange={(e) => addVideo(e)}
              ref={(input) => {
                if (isVideoClicked) {
                  input?.click(); // Trigger actual click when state is true
                }
              }}
            />
          </div>
          <span>Add video</span>
        </button>
      </div>
      <div className={styles.upload__bottom}>
        <div className={styles.attachment}>
          {images.map((imageFile, index) => (
            <div className={styles.attachmentItem} key={index}>
              <button onClick={() => handleRemoveImage(index)}>
                <Image
                  src='/icons/close.png'
                  alt='remove Image'
                  height={20}
                  width={20}
                />
              </button>
              <Image
                src={URL.createObjectURL(imageFile)}
                alt='Uploaded Image'
                height={200}
                width={200}
              />
            </div>
          ))}

          {videos.map((videoFile, index) => (
            <div className={styles.attachmentItem} key={index}>
              <button onClick={() => handleRemoveVideo(index)}>
                <Image
                  src='/icons/close.png'
                  alt='remove Image'
                  height={20}
                  width={20}
                />
              </button>
              <video width='200' height='200' controls>
                <source src={URL.createObjectURL(videoFile)} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
        <div className={styles.searchArea}>
          <Image
            src='/icons/edit-2.png'
            alt='write'
            height={16}
            width={16}
            className={styles.write}
          />
          {/* <input type="text" placeholder="Write something here..." /> */}
          <textarea
            placeholder='Write something here...'
            value={post}
            onChange={(e) => setPost(e.target.value)}
          ></textarea>
        </div>
      </div>
    </section>
  );
};

export default UploadTop;
