import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  email: string
  name: string
  role: "user" | "admin"
}

export async function createSession(data: SessionData) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify(data)
  const encodedSession = Buffer.from(sessionData).toString("base64")

  cookieStore.set("session", encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = Buffer.from(sessionCookie.value, "base64").toString()
    return JSON.parse(sessionData)
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
