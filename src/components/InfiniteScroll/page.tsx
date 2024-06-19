'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Loader from "../Loader/page";

interface Props {
  children: React.ReactNode;
  data: unknown[];
  setData: Dispatch<SetStateAction<any[]>>;
  setIsData: Dispatch<SetStateAction<boolean>>;
  fetchCallback: (skip: number, limit: number, route: string) => Promise<{ data: unknown[] }>;
  route: string;
  limit: number;
}

export const InfiniteScroll: React.FC<Props> = ({ children, data, setData, setIsData, fetchCallback, route, limit }) => {
  const [hasMore, setHasMore] = useState<boolean>(true); // Initially assume there is more data
  const [isLoading, setIsLoading] = useState(false);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: newData } = await fetchCallback(0, limit, route);
      if (newData.length === 0) setIsData(false)
      setData(newData);
      setHasMore(newData.length === limit);
      setIsLoading(false);
      setInitialFetchDone(true); // Set flag after initial fetch
    };

    fetchData(); // Fetch data on initial render
  }, [fetchCallback, route, limit, setData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && initialFetchDone) {
        loadMoreData();
      }
    });

    const loadMoreData = async () => {
      setIsLoading(true);
      const nextSkip = data.length;
      const { data: newData } = await fetchCallback(nextSkip, limit, route);
      setData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length === limit);
      setIsLoading(false);
    };

    if (hasMore && initialFetchDone) {
      if (lastItemRef.current) {
        observer.observe(lastItemRef.current);
      }
    }

    return () => observer.disconnect(); // Cleanup on unmount
  }, [data, setData, fetchCallback, route, limit, hasMore, initialFetchDone]);

  return (
    <>
      {children}
      {isLoading && <Loader />}
      <div ref={lastItemRef} style={{ height: 10, background: 'transparent' }}></div>
    </>
  );
};

export default InfiniteScroll;
