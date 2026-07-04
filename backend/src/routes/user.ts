import { Router, Request, Response } from "express";
import { protect } from "../middleware/auth";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const router = Router();

// ─── GET /api/users/profile ─────────────────────────────────
// Get profile details of the current logged-in user
router.get("/profile", protect, async (req: Request, res: Response): Promise<void> => {
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
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// ─── PUT /api/users/profile ─────────────────────────────────
// Update profile details of the current logged-in user
router.put("/profile", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const {
      fullName,
      avatar,
      phone,
      bio,
      skills,
      experience,
      education,
      careerGoal,
      targetRole,
      targetCompany,
    } = req.body;

    // Update simple fields
    if (fullName !== undefined) user.fullName = fullName;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (careerGoal !== undefined) user.careerGoal = careerGoal;
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (targetCompany !== undefined) user.targetCompany = targetCompany;

    // Update array fields if provided
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : [];
    }

    if (experience !== undefined) {
      if (Array.isArray(experience)) {
        user.experience = experience.map((exp: any) => ({
          company: exp.company?.trim() || "",
          role: exp.role?.trim() || "",
          duration: exp.duration?.trim() || "",
          description: exp.description?.trim() || "",
        }));
      } else {
        user.experience = [];
      }
    }

    if (education !== undefined) {
      if (Array.isArray(education)) {
        user.education = education.map((edu: any) => ({
          institution: edu.institution?.trim() || "",
          degree: edu.degree?.trim() || "",
          field: edu.field?.trim() || "",
          year: edu.year?.trim() || "",
        }));
      } else {
        user.education = [];
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
      return;
    }

    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

export default router;
