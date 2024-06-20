import Setup from '@/lib/setupdb'
import styles from './page.module.css'
import { auth, signIn } from '@/auth'
import Image from 'next/image'
import { dateFormat } from '@/lib/data'
import { Button } from './button'
import Link from 'next/link'

export default async function Notificatons() {
  const {users: userCollection} = await Setup()
  const session = await auth()
  const userSession = session?.user
  if (!userSession) signIn()
  const {notifications, following} = await userCollection?.findOne({ email: userSession?.email }) as unknown as UserPlus

  return <main className={styles.main}>
    <h2>Notifications</h2>
    {notifications.length === 0 ? <h3>Nothing to see here, All caught up</h3> : (
      notifications.map((notification, index) => {
        const date = new Date(notification.date)
        const now = new Date()
        const username = notification.msg.split(' ')[0]
        return <div key={index} className={styles.notification}>
          {notification.avatar && <Image src={notification.avatar} alt={''} height={70} width={70} />}
          <div className={styles.details}>
            <Link href={`/home/profile/${username}`}><p>{notification.msg}</p> </Link>
            <span><i>{dateFormat(date, now)}</i></span>
          {notification.type === "followed" && !following.includes(notification.userId) && <Button id={notification.userId} />}
          </div>
        </div>
      })
    )}
  </main>
}