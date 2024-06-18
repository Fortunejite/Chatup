import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { auth, signIn } from '@/auth';
import LogoutBtn from './logout/logout';

interface link {
  icon: string;
  name: string;
  href: string;
}

const links: link[] = [
  {
    icon: '/icons/user.png',
    name: 'Profile',
    href: '/home/profile',
  },
  {
    icon: '/icons/people.png',
    name: 'Find friends',
    href: '/friends',
  },
  {
    icon: '/icons/status-up.png',
    name: 'User Analytics',
    href: '/analytics',
  },
];

const settings: link[] = [
  {
    icon: '/icons/setting-2.png',
    name: 'Settings',
    href: '/settings',
  },
  {
    icon: '/icons/setting-2.png',
    name: 'Security data',
    href: '/settings',
  },
];

const Sidebar = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user) {
    return signIn();
  }
  return (
    <>
      <aside className={styles.container}>
        <section className={styles.hero}>
          <Image src={user.pic} alt='Logo' width={100} height={100} />
          <h1 className='truncate'>{`${user.firstName} ${user.lastName}`}</h1>
        </section>
        <section className={styles.panel}>
          <h3>Explore panel</h3>
          <ul className={styles.ul}>
            {links.map((link) => {
              return (
                <li key={link.name}>
                  <Link href={link.href} className={styles.link}>
                    <div className={styles.imgContainer}>
                      <Image
                        className={styles.img}
                        src={link.icon}
                        alt={link.name}
                        width={16}
                        height={16}
                      />
                    </div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.settings}>
          <h3>Settings</h3>
          <ul className={styles.ul}>
            {settings.map((link) => {
              return (
                <li key={link.name}>
                  <Link href={link.href} className={styles.link}>
                    <div className={styles.imgContainer}>
                      <Image
                        className={styles.img}
                        src={link.icon}
                        alt={link.name}
                        width={16}
                        height={16}
                      />
                    </div>
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <LogoutBtn />
        </section>
      </aside>
    </>
  );
};
export default Sidebar;
