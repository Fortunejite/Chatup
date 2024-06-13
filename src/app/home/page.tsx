import styles from "./page.module.css"
import Right_sidebar from "@/components/Right_sidebar/page"
import Posts from "@/components/Posts/page"
import { auth, signIn } from "@/auth"
import UploadTop from "./uploadTop"
import { useState } from "react"
const Home = async () => {
  const session = await auth()
  if (!session) return signIn()
  return (
    <>
    <main className={styles.main}>
      <UploadTop />
      <section className={styles.posts}>
        <Posts />
      </section>
    </main>
    <Right_sidebar />
    </>
  )
}

export default Home