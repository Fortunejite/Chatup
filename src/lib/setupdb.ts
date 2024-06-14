import clientPromise from './db';
import { Collection, Document } from 'mongodb';

interface collections {
  users?: Collection<Document>;
  messages?: Collection<Document>;
  groups?: Collection<Document>;
  groupMessages?: Collection<Document>;
  posts?: Collection<Document>;
}

const Setup = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE || 'Chat');
  const collections: collections = {
    users: db.collection<Document>('users'),
    messages: db.collection<Document>('messages'),
    groups: db.collection<Document>('groups'),
    groupMessages: db.collection<Document>('groupMessages'),
    posts: db.collection<Document>('posts'),
  };
  return collections;
};
export default Setup;
