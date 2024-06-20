import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    id: string;
    email?: string;
    firstName: string;
    lastName: string;
    username: string;
    pic: string;
    password?: string;
    avatar?: string;
  }

  interface User {
    _id: string;
    email?: string;
    firstName: string;
    lastName: string;
    username: string;
    pic: string;
    password?: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email?: string;
    firstName: string;
    lastName: string;
    username: string;
    pic: string;
    password?: string;
    avatar?: string;
  }
}
