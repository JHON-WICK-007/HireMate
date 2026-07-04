import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback as GoogleVerifyCallback } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import User, { IUser } from "../models/User";

// ─── Google Strategy ─────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "temp_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp_secret",
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done: GoogleVerifyCallback
    ): Promise<void> => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          done(new Error("No email found in Google profile"), undefined);
          return;
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            fullName: profile.displayName || "Google User",
            email,
            avatar: profile.photos?.[0]?.value || "",
            googleId: profile.id,
            authProvider: "google",
            skills: [],
            experience: [],
            education: [],
          });
        } else if (!user.googleId) {
          // Link Google ID if user already exists locally
          user.googleId = profile.id;
          user.authProvider = "google";
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value || "";
          }
          await user.save();
        }

        done(null, user as IUser);
      } catch (err: unknown) {
        done(err as Error, undefined);
      }
    }
  )
);

// ─── GitHub Strategy ─────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "temp_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "temp_secret",
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (err: Error | null, user?: IUser | false) => void
    ): Promise<void> => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await User.findOne({
          $or: [{ githubId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            fullName: profile.displayName || profile.username || "GitHub User",
            email,
            avatar: profile.photos?.[0]?.value || "",
            githubId: profile.id,
            authProvider: "github",
            skills: [],
            experience: [],
            education: [],
          });
        } else if (!user.githubId) {
          // Link GitHub ID if user already exists locally
          user.githubId = profile.id;
          user.authProvider = "github";
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value || "";
          }
          await user.save();
        }

        done(null, user as IUser);
      } catch (err: unknown) {
        done(err as Error, false);
      }
    }
  )
);
