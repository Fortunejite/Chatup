'use client'

import { useState } from "react";
import { toast } from "react-toastify";

export function Button ({id} : {id: string | undefined}) {
  const [followed, setfollowed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleFollow = async () => {
    setIsLoading(true);
     const res = await fetch(`/api/user/follow/${id}`, {
      method: 'PUT',
    })
    if (res.ok) {
      setfollowed(true)
    } else toast("An error occured")
    setIsLoading(false);
  };

  if (!followed) return <button disabled={isLoading} onClick={handleFollow}>Follow back</button>
  return <p>Following</p>
}