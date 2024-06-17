"use client"
import styles from './navbar.module.css';
import { useDrawer } from "../Providers"
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'

const Button = () => {
  const pathname = usePathname()
  const {isOpen, setIsOpen} = useDrawer()
  useEffect(() => {setIsOpen(false)}, [pathname])
  return <button onClick={() => setIsOpen(true)}><div className={`${styles.menu_icon} ${isOpen ? `${styles.active}` : ''}`}></div></button>
}

export default Button