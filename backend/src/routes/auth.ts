import { Router, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import passport from "passport";
import User, { IUser } from "../models/User";
import { protect } from "../middleware/auth";
import "../config/passport";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const router = Router();

// ─── Helper: Generate JWT Token ─────────────────────────────
const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

// ─── Helper: Send token response with cookie ────────────────
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user._id.toString());

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      skills: user.skills,
      careerGoal: user.careerGoal,
      targetRole: user.targetRole,
      createdAt: user.createdAt,
    },
  });
};

// ─── POST /api/auth/register ────────────────────────────────
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields and types
    if (typeof fullName !== "string" || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid input types.",
      });
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password.",
      });
      return;
    }

    // Name length and format check
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters.",
      });
      return;
    }

    if (!/^[a-zA-Z]+([ \'-][a-zA-Z]+)*$/.test(trimmedName)) {
      res.status(400).json({
        success: false,
        message: "Full name must contain only letters, spaces, hyphens or apostrophes and start with a letter.",
      });
      return;
    }

    // Email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    // Password strength check (Minimum 12 chars, 1 upper, 1 lower, 1 digit, 1 special)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
      return;
    }

    // Create user
    const user = await User.create({
      fullName: trimmedName,
      email: trimmedEmail,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
      return;
    }

    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate type and existence
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid input types.",
      });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
      return;
    }

    // Find user with password field
    const user = await User.findOne({ email: trimmedEmail }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────
router.get("/me", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

// ─── POST /api/auth/logout ──────────────────────────────────
router.post("/logout", (_req: Request, res: Response): void => {
  res.cookie("token", "none", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

// ─── GET /api/auth/google ───────────────────────────────────
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account", session: false }));

// ─── GET /api/auth/google/callback ──────────────────────────
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/auth?error=oauth_failed`,
  }),
  (req: Request, res: Response): void => {
    if (req.user) {
      const user = req.user as any;
      const token = generateToken(user._id.toString());
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
      res.cookie("token", token, cookieOptions);

      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth?token=${token}`);
    } else {
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth?error=oauth_failed`);
    }
  }
);

// ─── GET /api/auth/github ───────────────────────────────────
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

// ─── GET /api/auth/github/callback ──────────────────────────
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/auth?error=oauth_failed`,
  }),
  (req: Request, res: Response): void => {
    if (req.user) {
      const user = req.user as any;
      const token = generateToken(user._id.toString());
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
      res.cookie("token", token, cookieOptions);

      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth?token=${token}`);
    } else {
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth?error=oauth_failed`);
    }
  }
);

export default router;
