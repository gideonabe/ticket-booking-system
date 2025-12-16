import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { createUser } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error signing up:", error)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}
