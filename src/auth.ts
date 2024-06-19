import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/db';
import { compare } from 'bcrypt';
import { object, string, ZodError } from 'zod';
import Setup from './lib/setupdb';

const User = object({
  username: string()
    .min(3, { message: 'Username must be a minimum of 3 characters' })
    .max(20, { message: 'Username must be a maximum of 20 characters' }),
  password: string().min(6, {
    message: 'Password must be a minimum of 6 characters',
  }),
  // pic: string()
});

const option: NextAuthConfig = {
  // adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/',
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { users } = await Setup();
        const { username, password } = User.parse(credentials);
        const user = await users?.findOne({ username });
        if (!user) {
          // throw new Error("Username already exists")
          return null;
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
          // throw new Error("Incorrect password")
          return null;
        }
        return {
          _id: user._id,
          email: user.email,
          username: user.username,
          pic: user.avatar || '/icons/profile.png',
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
        token.pic = user.pic;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.pic = token.pic as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(option);
