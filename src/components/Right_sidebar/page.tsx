import Setup from '@/lib/setupdb';
import styles from './page.module.css';
import People from '../people/page';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';

const Right_sidebar = async () => {
  const {users: userCollection} = await Setup()
  const users = await userCollection?.aggregate([{ $sample: { size: 3 } }])?.toArray() as UserPlus[] || [] as UserPlus[]
  const session = await auth()
  const userSession = session?.user
  const user = (await userCollection?.findOne({
    _id: new ObjectId(userSession?.id),
  })) as unknown as UserPlus;
  return (
    <aside className={styles.container}>
      <h2>People you may know</h2>
      <div className={styles.users}>
        {users.map((user) => {
          const {username, avatar, lastName, firstName, followers}= user
          const id = user._id?.toString() || ''
          const isFollowing = user.following.includes(id)
          return <People key={id} user={{id, username, avatar, lastName, firstName, followers, isFollowing}}/>
        })}
      </div>
    </aside>
  );
};

export default Right_sidebar;
