import { Schema, model, models } from "mongoose"

export interface IUser {
  _id: string
  email: string
  password: string
  name: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
)

UserSchema.index({ email: 1 })

export const User = models.User || model<IUser>("User", UserSchema)
