"""
HireMate ML Service — Configuration
"""
import os

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hiremate")

# MLflow
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "file:///app/mlruns")

# Server
ML_SERVICE_PORT = int(os.getenv("ML_SERVICE_PORT", "8000"))
NODE_ENV = os.getenv("NODE_ENV", "development")

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models", "saved")
os.makedirs(MODEL_DIR, exist_ok=True)

# Skills taxonomy — used for skill extraction and gap analysis
TECH_SKILLS = [
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby",
    "php", "swift", "kotlin", "react", "angular", "vue", "next.js", "node.js",
    "express", "django", "flask", "fastapi", "spring", "spring boot",
    "html", "css", "tailwind", "bootstrap", "sass",
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "ci/cd", "git", "github", "gitlab",
    "rest", "graphql", "grpc", "microservices", "api",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "data structures", "algorithms", "system design", "oop",
    "agile", "scrum", "jira", "linux", "bash",
    "firebase", "supabase", "vercel", "netlify",
    "figma", "photoshop", "illustrator",
]

# Role-skill mapping — what skills are expected for common roles
ROLE_SKILL_MAP = {
    "frontend developer": ["html", "css", "javascript", "react", "typescript", "tailwind", "next.js", "git", "rest", "figma"],
    "backend developer": ["node.js", "express", "python", "sql", "mongodb", "rest", "docker", "git", "api", "linux"],
    "full stack developer": ["html", "css", "javascript", "react", "node.js", "express", "mongodb", "sql", "git", "docker", "rest", "typescript"],
    "data scientist": ["python", "pandas", "numpy", "scikit-learn", "machine learning", "sql", "tensorflow", "deep learning", "nlp", "matplotlib"],
    "data analyst": ["python", "pandas", "numpy", "sql", "excel", "tableau", "power bi", "statistics", "data visualization"],
    "devops engineer": ["docker", "kubernetes", "aws", "terraform", "jenkins", "ci/cd", "linux", "bash", "git", "monitoring"],
    "mobile developer": ["react native", "flutter", "swift", "kotlin", "firebase", "rest", "git"],
    "ml engineer": ["python", "tensorflow", "pytorch", "scikit-learn", "machine learning", "deep learning", "docker", "mlflow", "pandas", "numpy"],
    "software engineer": ["data structures", "algorithms", "system design", "oop", "git", "sql", "python", "java", "docker", "rest"],
    "cloud engineer": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "ci/cd", "networking"],
}
