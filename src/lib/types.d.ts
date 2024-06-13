interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  pic: string;
  password?: string;
}

interface UserPlus extends User {
  bio: string;
  friends: string[];
  friendRequest: string[];
  pendingRequests: string[];
  following: string[],
  followers: string[]
  notifications: string[];
  groups: any;
  isActive: boolean;
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
  author: User,
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