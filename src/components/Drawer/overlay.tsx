"use client"
import styles from './page.module.css'
import { useDrawer } from '../Providers';

const Overlay = () => {
  const {isOpen, setIsOpen} = useDrawer()
  return isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)}></div>
}

export default Overlay;