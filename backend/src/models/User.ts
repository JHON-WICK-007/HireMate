import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// ─── Interface ──────────────────────────────────────────────
export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  authProvider: "local" | "google" | "github";
  avatar?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  careerGoal?: string;
  targetRole?: string;
  targetCompany?: string;
  resumeUrl?: string;
  resumeParsedData?: Record<string, unknown>;
  interviewHistory: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ─────────────────────────────────────────────────
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [
        function (this: IUser) {
          return this.authProvider === "local" || (!this.googleId && !this.githubId);
        },
        "Password is required",
      ],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [{ type: String, trim: true }],
    experience: [
      {
        company: { type: String, trim: true },
        role: { type: String, trim: true },
        duration: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        field: { type: String, trim: true },
        year: { type: String, trim: true },
      },
    ],
    careerGoal: { type: String, trim: true },
    targetRole: { type: String, trim: true },
    targetCompany: { type: String, trim: true },
    resumeUrl: { type: String },
    resumeParsedData: { type: Schema.Types.Mixed },
    interviewHistory: [{ type: Schema.Types.ObjectId, ref: "Interview" }],
  },
  {
    timestamps: true,
  }
);

// ─── Hash password before saving ────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password method ────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
