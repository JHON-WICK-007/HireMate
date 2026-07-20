import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionLog {
  questionText: string;
  type: string; // 'Technical', 'Behavioral', 'HR', 'System design'
  userAnswer?: string;
  score?: number; // 0 to 100
  feedback?: string;
  strongAnswer?: string;
  competencies?: string[];
}

export interface IInterview extends Document {
  user: mongoose.Types.ObjectId;
  company: string;
  role: string;
  level: string;
  questionTypes: string[];
  questions: IQuestionLog[];
  currentQuestionIndex: number;
  totalQuestions: number;
  overallScore?: number;
  metrics?: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
  };
  status: "in-progress" | "completed";
  sessionName?: string;
  sessionNameNorm?: string;
  elapsedTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    questionTypes: [
      {
        type: String,
        trim: true,
      },
    ],
    questions: [
      {
        questionText: { type: String, required: true },
        type: { type: String, required: true },
        userAnswer: { type: String },
        score: { type: Number },
        feedback: { type: String },
        strongAnswer: { type: String },
        competencies: [{ type: String }],
      },
    ],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
    overallScore: {
      type: Number,
    },
    metrics: {
      technicalAccuracy: { type: Number },
      communication: { type: Number },
      problemSolving: { type: Number },
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    sessionName: {
      type: String,
      trim: true,
    },
    sessionNameNorm: {
      type: String,
      trim: true,
      select: false,
    },
    elapsedTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one session name per user (case-insensitive via norm field)
interviewSchema.index(
  { user: 1, sessionNameNorm: 1 },
  { unique: true, partialFilterExpression: { sessionNameNorm: { $type: "string" } } }
);

const Interview = mongoose.model<IInterview>("Interview", interviewSchema);
export default Interview;
