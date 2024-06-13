import { Collection, Document, MongoClient, ServerApiVersion } from "mongodb"

interface operators {
  users?: Collection<Document>,
  messages?: Collection<Document>,
  groups?: Collection<Document>,
  groupMessages?: Collection<Document>,
  posts?: Collection<Document>
}

const uri = process.env.MONGODB_URI || ""
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

class DBClient {
  _client: MongoClient;
  _db: string
  operations: operators
  constructor() {
    this._db =  process.env.MONGODB_DATABASE || 'Chat'
    this._client = new MongoClient(uri, options);
    this.operations = {}
    this._client.connect().then((client) => {
      const db = client.db(this._db)
      this.operations = {
        users: db.collection<Document>('users'),
        messages: db.collection<Document>('messages'),
        groups: db.collection<Document>('groups'),
        groupMessages: db.collection<Document>('groupMessages'),
        posts: db.collection<Document>('posts'),
      }
      console.log('Connected to MongoDB')
    })
  }
}
const dbClient = new DBClient()
export default dbClient