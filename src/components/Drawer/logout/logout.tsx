"use client"
import styles from "../page.module.css"
import Image from "next/image"
import { signOut } from "next-auth/react"
const LogoutBtn = ({}) => {
  return (
    <button className={styles.logout} onClick={() => signOut()}>
      <div className={`${styles.imgContainer} ${styles.logoutContainer}`}>
        <Image className={styles.img} src="/icons/logout.png" alt="Logout" width={16} height={16} />
      </div>
      <span>Logout</span>
    </button>
  )
}
export default LogoutBtn