'use client'

import { useEffect, useRef, useState } from "react";
import Loader from "../Loader/page";

export default function Update ({children, data, setData, fetchCallback}) {
  // const [post, setPost] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const fetchDataOnMount = async () => {
      // setIsLoading(true);
      const { posts: initialData } = await fetchCallback();
      setData(initialData);
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
      const nextSkip = data.length;
      const { posts: newData } = await fetchPosts(nextSkip);
      setData((prevData) => [...prevData, ...newData]);
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

  return(
    <>
    {children}
      {isLoading && <Loader />}
    </>
  )
}