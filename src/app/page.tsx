import Image from "next/image";
import styles from "./page.module.css";
import Form from "@/components/Form/Form"

export default function Home() {
  return (
    <div className={styles.container}>
          <Image src="/icons/Illustration.png" alt="illustration" priority={true} height={500} width={500} className={styles.img}/>
        <Form /> 
    </div>
  )
}