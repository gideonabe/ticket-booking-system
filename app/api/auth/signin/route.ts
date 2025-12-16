import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await createSession(user)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error signing in:", error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
