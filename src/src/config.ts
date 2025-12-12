// This handles the environment variable with a fallback for local development
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7260";