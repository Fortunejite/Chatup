import Link from "next/link"
import styles from "./links.module.css"
import Image from "next/image"

interface link {
  id: number;
  url: string;
  icon: string;
  alt: string;
}

const Links = (link: link) => {
  return (
    <Link className={styles.container} href={link.url} key={link.id}>
      <Image className={styles.Icon} src={link.icon} alt={link.alt} height={32} width={32} />
    </Link>
  )
}

export default Links