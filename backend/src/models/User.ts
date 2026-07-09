import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
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
      match: [/^[a-zA-Z]+([ \'-][a-zA-Z]+)*$/, "Full name must contain only letters, spaces, hyphens or apostrophes and start with a letter"],
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
      minlength: [12, "Password must be at least 12 characters"],
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
      validate: {
        validator: function(v: string) {
          // Allow empty string, but if provided, it must be 7-20 characters matching phone symbols
          return !v || /^[\d\s()+-]{7,20}$/.test(v);
        },
        message: "Please enter a valid phone number (7 to 20 digits, spaces, dashes or symbols)."
      }
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [{
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.#+()\-]{1,30}$/.test(v);
        },
        message: "Skill name must contain at least one letter and up to 30 valid characters."
      }
    }],
    experience: [
      {
        company: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/.test(v);
            },
            message: "Company name must contain at least one letter and be between 2 and 50 characters."
          }
        },
        role: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/.test(v);
            },
            message: "Role must contain at least one letter and be between 2 and 50 characters."
          }
        },
        duration: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*(\d|present|current))[a-zA-Z0-9\s.,\-\–/()]{2,30}$/i.test(v);
            },
            message: "Duration must refer to a time period (containing a year/number or 'present'/'current')."
          }
        },
        description: {
          type: String,
          trim: true,
          maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
      },
    ],
    education: [
      {
        institution: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(v);
            },
            message: "Institution must contain at least one letter and be between 2 and 100 characters."
          }
        },
        degree: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(v);
            },
            message: "Degree must contain at least one letter and be between 2 and 100 characters."
          }
        },
        field: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(v);
            },
            message: "Field of study must contain at least one letter and be between 2 and 100 characters."
          }
        },
        year: {
          type: String,
          trim: true,
          validate: {
            validator: function(v: string) {
              return !v || /^(?=.*(\d|present|expected))[a-zA-Z0-9\s\-\–]{4,15}$/i.test(v);
            },
            message: "Year must refer to a time period (containing a year/number or 'present'/'expected')."
          }
        },
      },
    ],
    careerGoal: {
      type: String,
      trim: true,
      maxlength: [500, "Career goal cannot exceed 500 characters"]
    },
    targetRole: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/.test(v);
        },
        message: "Target role must contain at least one letter and be between 2 and 50 characters."
      }
    },
    targetCompany: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/.test(v);
        },
        message: "Target company must contain at least one letter and be between 2 and 50 characters."
      }
    },
    resumeUrl: { type: String },
    resumeParsedData: { type: Schema.Types.Mixed },
    interviewHistory: [{ type: Schema.Types.ObjectId, ref: "Interview" }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
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

// ─── Generate and hash password token ───────────────────────
userSchema.methods.getResetPasswordToken = function (): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire to 10 minutes
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
