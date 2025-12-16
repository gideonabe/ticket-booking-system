import bcrypt from "bcryptjs"
import { User } from "@/lib/models/User"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name: string, role: "user" | "admin" = "user") {
  const hashedPassword = await hashPassword(password)
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    role,
  })
  return user
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  }
}
