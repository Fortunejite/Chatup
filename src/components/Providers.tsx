'use client';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
const DrawerContext = createContext<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export function DrawerProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ isOpen: isOpen, setIsOpen: setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => {
  return useContext(DrawerContext);
};
