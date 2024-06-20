'use client';
import { useState } from 'react';
import styles from './page.module.css';
import InfiniteScroll from '@/components/InfiniteScroll/page';
import { fetchUsers } from '@/lib/fetchUsers';
import People from '@/components/people/page';

export default function FindFriends() {
  const [users, setUsers] = useState<UserPlus[]>([]);
  const [isUsers, setIsUsers] = useState(true);
  return (
    <main className={styles.main}>
      <h2>People you may know</h2>
      <InfiniteScroll
        data={users}
        setData={setUsers}
        setIsData={setIsUsers}
        limit={10}
        route='/api/user'
        fetchCallback={fetchUsers}
      >
        <div className={styles.users}>
          {users.map((user) => {
            const { username, avatar, lastName, firstName, followers } = user;
            const id = user._id?.toString() || '';
            const isFollowing = user.following.includes(id);
            return (
              <People
                key={id}
                user={{
                  id,
                  username,
                  avatar,
                  lastName,
                  firstName,
                  followers,
                  isFollowing,
                }}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </main>
  );
}
