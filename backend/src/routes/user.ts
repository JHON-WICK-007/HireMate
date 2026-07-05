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

    // Update simple fields with type safety
    if (fullName !== undefined) {
      if (typeof fullName !== "string") {
        res.status(400).json({ success: false, message: "Full name must be a string." });
        return;
      }
      const trimmedName = fullName.trim();
      if (!/^[a-zA-Z]+([ \'-][a-zA-Z]+)*$/.test(trimmedName)) {
        res.status(400).json({ success: false, message: "Full name must contain only letters, spaces, hyphens or apostrophes and start with a letter." });
        return;
      }
      user.fullName = trimmedName;
    }

    if (avatar !== undefined) {
      if (typeof avatar !== "string") {
        res.status(400).json({ success: false, message: "Avatar must be a string." });
        return;
      }
      user.avatar = avatar.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        res.status(400).json({ success: false, message: "Phone must be a string." });
        return;
      }
      const trimmedPhone = phone.trim();
      if (trimmedPhone && !/^[\d\s()+-]{7,20}$/.test(trimmedPhone)) {
        res.status(400).json({ success: false, message: "Please enter a valid phone number (7 to 20 digits, spaces, dashes or symbols)." });
        return;
      }
      user.phone = trimmedPhone;
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        res.status(400).json({ success: false, message: "Bio must be a string." });
        return;
      }
      user.bio = bio.trim();
    }

    if (careerGoal !== undefined) {
      if (typeof careerGoal !== "string") {
        res.status(400).json({ success: false, message: "Career goal must be a string." });
        return;
      }
      user.careerGoal = careerGoal.trim();
    }

    if (targetRole !== undefined) {
      if (typeof targetRole !== "string") {
        res.status(400).json({ success: false, message: "Target role must be a string." });
        return;
      }
      const trimmedRole = targetRole.trim();
      if (trimmedRole && !/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/.test(trimmedRole)) {
        res.status(400).json({ success: false, message: "Target role must contain at least one letter and be between 2 and 50 characters." });
        return;
      }
      user.targetRole = trimmedRole;
    }

    if (targetCompany !== undefined) {
      if (typeof targetCompany !== "string") {
        res.status(400).json({ success: false, message: "Target company must be a string." });
        return;
      }
      const trimmedCompany = targetCompany.trim();
      if (trimmedCompany && !/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/.test(trimmedCompany)) {
        res.status(400).json({ success: false, message: "Target company must contain at least one letter and be between 2 and 50 characters." });
        return;
      }
      user.targetCompany = trimmedCompany;
    }

    // Update array fields if provided with validation
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        res.status(400).json({ success: false, message: "Skills must be an array." });
        return;
      }
      const mappedSkills = skills
        .filter((s) => typeof s === "string" || typeof s === "number")
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0);
      for (const s of mappedSkills) {
        if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.#+()\-]{1,30}$/.test(s)) {
          res.status(400).json({ success: false, message: `Skill name "${s}" must contain at least one letter and contain only valid characters.` });
          return;
        }
      }
      user.skills = mappedSkills;
    }

    if (experience !== undefined) {
      if (!Array.isArray(experience)) {
        res.status(400).json({ success: false, message: "Experience must be an array." });
        return;
      }
      const companyRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/;
      const roleRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/;
      const durationRegex = /^(?=.*(\d|present|current))[a-zA-Z0-9\s.,\-\–/()]{2,30}$/i;
      const mappedExp = [];
      for (const exp of experience) {
        if (!exp || typeof exp !== "object") continue;
        const company = String(exp.company || "").trim();
        const role = String(exp.role || "").trim();
        const duration = String(exp.duration || "").trim();
        const description = String(exp.description || "").trim();

        if (company || role || duration || description) {
          if (!company) { res.status(400).json({ success: false, message: "Company name is required." }); return; }
          if (!companyRegex.test(company)) { res.status(400).json({ success: false, message: "Company name must contain at least one letter and be between 2 and 50 characters." }); return; }
          if (!role) { res.status(400).json({ success: false, message: "Role / Title is required." }); return; }
          if (!roleRegex.test(role)) { res.status(400).json({ success: false, message: "Role must contain at least one letter and be between 2 and 50 characters." }); return; }
          if (duration && !durationRegex.test(duration)) { res.status(400).json({ success: false, message: "Duration must refer to a time period (containing a year/number or 'present'/'current')." }); return; }
          if (description && description.length > 1000) { res.status(400).json({ success: false, message: "Description cannot exceed 1000 characters." }); return; }
          mappedExp.push({ company, role, duration, description });
        }
      }
      user.experience = mappedExp;
    }

    if (education !== undefined) {
      if (!Array.isArray(education)) {
        res.status(400).json({ success: false, message: "Education must be an array." });
        return;
      }
      const textRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/;
      const yearRegex = /^(?=.*(\d|present|expected))[a-zA-Z0-9\s\-\–]{4,15}$/i;
      const mappedEdu = [];
      for (const edu of education) {
        if (!edu || typeof edu !== "object") continue;
        const institution = String(edu.institution || "").trim();
        const degree = String(edu.degree || "").trim();
        const field = String(edu.field || "").trim();
        const year = String(edu.year || "").trim();

        if (institution || degree || field || year) {
          if (!institution) { res.status(400).json({ success: false, message: "Institution is required." }); return; }
          if (!textRegex.test(institution)) { res.status(400).json({ success: false, message: "Institution must contain at least one letter and be between 2 and 100 characters." }); return; }
          if (!degree) { res.status(400).json({ success: false, message: "Degree is required." }); return; }
          if (!textRegex.test(degree)) { res.status(400).json({ success: false, message: "Degree must contain at least one letter and be between 2 and 100 characters." }); return; }
          if (field && !textRegex.test(field)) { res.status(400).json({ success: false, message: "Field of study must contain at least one letter and be between 2 and 100 characters." }); return; }
          if (year && !yearRegex.test(year)) { res.status(400).json({ success: false, message: "Year must refer to a time period (containing a year/number or 'present'/'expected')." }); return; }
          mappedEdu.push({ institution, degree, field, year });
        }
      }
      user.education = mappedEdu;
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
