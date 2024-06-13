import setup from "@/lib/setupdb"
import { hash } from "bcrypt";
import { ZodError, object, string } from "zod";
import { NextResponse } from 'next/server';
import { signIn } from "@/auth";

interface Credentials {
  username: string;
  password: string;
  email: string;
}

const User = object({
  email: string().email({ message: "Invalid email address" }),
  username: string().min(3, { message: "Username must be a minimum of 3 characters" }).max(20, { message: "Username must be a maximum of 20 characters" }),
  password: string().min(6, { message: "Password must be a minimum of 6 characters" }),
  firstName: string().min(0, "First Name is required"),
  lastName: string().min(0, "Last Name is required"),
})

export async function POST(request: Request) {
  try {
    const { users } = await setup()
    const credentials: Credentials = await request.json()
    const {username, email, password, firstName, lastName} = User.parse(credentials)
    let availableUser = await users?.findOne({ username });
    if (availableUser) {
      return NextResponse.json({ msg: "Username already exists" }, {status: 409})
    }
    availableUser = await users?.findOne({ email });
    if (availableUser) {
      return NextResponse.json({ msg: "Email already exists" }, {status: 409})
    }
    const hashedPassword = await hash(password, 10)
    const user = await users?.insertOne({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      followers: [],
      following: [],
      friends: [],
      friendRequest: [],
      pendingRequests: [],
      notifications: [],
      groups: {},
      avatar: "",
      bio: "",
      isActive: false,
    })
    return NextResponse.json( {msg: "signup successful" }, {status: 201})
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ msg: e.issues[0].message }, {status: 409})
    }
  }
}