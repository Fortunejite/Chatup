import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { compare } from 'bcrypt';
import { object, string } from 'zod';
import { v4 } from 'uuid';
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
      credentials: {},
      authorize: async (credentials) => {
        const { users } = await Setup();
        const { username, password } = User.parse(credentials);
        const user = await users?.findOne({ username });
        if (!user) {
          // throw new Error("Username already exists")
          return null;
        }
        if (user.provider) return null;
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
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const { email, name, image } = user || {};
  
        if (email) {
          const { users } = await Setup();
          let existingUser = await users?.findOne({ email });
  
          if (!existingUser) {
            const [firstName, ...lastNameParts] = name?.split(' ');
            const lastName = lastNameParts.join(' ');
            const username = `user${v4()}`;
  
            const newUser = await users?.insertOne({
              username,
              email,
              firstName,
              lastName,
              provider: 'google',
              followers: [],
              following: [],
              friends: [],
              friendRequest: [],
              pendingRequests: [],
              notifications: [],
              groups: {},
              avatar: image,
              bio: '',
              isActive: false,
            });
  
            if (newUser?.acknowledged) {
              token.id = newUser?.insertedId.toString();
              token.email = email;
              token.username = username;
              token.pic = image || '/icons/profile.png';
              token.firstName = firstName;
              token.lastName = lastName;
            }
          } else {
            token.id = existingUser?._id.toString();
            token.email = email;
            token.username = existingUser?.username;
            token.pic = image || '/icons/profile.png';
            token.firstName = existingUser?.firstName;
            token.lastName = existingUser?.lastName;
          }
        }
      } else {
        // Fallback for other providers or if account is not defined
        if (user) {
          token.id = user?._id?.toString();
          token.email = user?.email;
          token.username = user?.username;
          token.pic = user?.pic || '/icons/profile.png';
          token.firstName = user?.firstName;
          token.lastName = user?.lastName;
        }
      }
  
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.pic = token.pic;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
  
      return session;
    },
  }
  
};

export const { handlers, signIn, signOut, auth } = NextAuth(option);
