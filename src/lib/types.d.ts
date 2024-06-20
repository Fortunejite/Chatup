interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  pic: string;
  password?: string;
  avatar?: string;
}

interface Notification {
  msg: string;
  type: 'followed';
  avatar?: string;
  date: Date;
  status: 'unread' | 'read';
  userId: string;
}

interface UserPlus extends User {
  _id?: string;
  bio: string;
  friends: string[];
  friendRequest: string[];
  pendingRequests: string[];
  following: string[],
  followers: string[]
  notifications: Notification[];
  groups: any;
  isActive: boolean;
  provider?: 'google' | 'facebook';
}

interface Author {
  username: string;
  avatar: string;
  lastName: string;
  firstName: string;
}

interface Post {
  _id: string,
  userId: string,
  author: Author,
  date: Date,
  text: string,
  images: string[],
  videos: string[],
  likes: {
    data: string[],
    count: number
  },
  comments: {
    data: string[],
    count: number
  },
}