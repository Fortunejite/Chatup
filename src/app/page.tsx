import Image from 'next/image';
import styles from './page.module.css';
import Form from '@/components/Form/Form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth()
  if (session) redirect("/home")
  return (
    <div className={styles.container}>
      <Image
        src='/icons/Illustration.png'
        alt='illustration'
        priority={true}
        height={500}
        width={500}
        className={styles.img}
      />
      <Form />
    </div>
  );
}
