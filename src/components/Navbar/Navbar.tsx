import Image from 'next/image';
import styles from './navbar.module.css';
import Links from './Links/links';
import { auth, signIn } from '@/auth';
import Link from 'next/link';
import Button from './button';

interface link {
  id: number;
  url: string;
  icon: string;
  alt: string;
}

const links: link[] = [
  {
    id: 1,
    url: '/messages',
    icon: '/icons/message.png',
    alt: 'Messages',
  },
  {
    id: 2,
    url: '/notifications',
    icon: '/icons/notifications.png',
    alt: 'Notifications',
  },

  {
    id: 3,
    url: '/settings',
    icon: '/icons/setting-2.png',
    alt: 'Settings',
  },
];

const Navbar = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user) {
    return signIn();
  }
  return (
    <nav className={styles.container}>
      <div className={styles.top}>
        <Link href='/home'>
          <Image
            src='/icons/logo.png'
            alt='Logo'
            height={54}
            width={55}
            className={styles.logo}
          />
        </Link>
        {/* <button>Drawer</button> */}
        <div className={styles.searchArea}>
          <Image
            src='/icons/search-normal.png'
            alt='search'
            height={24}
            width={24}
            className={styles.search}
          />
          <input type='text' placeholder='Search for friends here ...' />
        </div>
        <div className={styles.profile}>
          <Image src={user.pic} height={58} width={58} alt='avater' />
          <div>
            <h3>{`${user.firstName} ${user.lastName}`}</h3>
            <p>@{user.username}</p>
          </div>
        </div>
      </div>
      <div className={styles.options}>
        {links.map((link) => (
          <Links
            id={link.id}
            url={link.url}
            icon={link.icon}
            alt={link.alt}
            key={link.id}
          />
        ))}
        <Button />
      </div>
    </nav>
  );
};

export default Navbar;
