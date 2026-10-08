const env = import.meta.env;

const clean = (value) => (typeof value === "string" ? value.trim() : value);

export const APPWRITE = {
  endpoint: clean(env.VITE_APPWRITE_ENDPOINT)?.replace(/\/$/, ""),
  projectId: clean(env.VITE_APPWRITE_PROJECT_ID),
  databaseId: clean(env.VITE_APPWRITE_DATABASE_ID),
  bucketId: clean(env.VITE_APPWRITE_BUCKET_ID),
  tables: {
    profiles: clean(env.VITE_APPWRITE_PROFILES_TABLE_ID),
    projects: clean(env.VITE_APPWRITE_PROJECTS_TABLE_ID),
    members: clean(env.VITE_APPWRITE_PROJECT_MEMBERS_TABLE_ID),
    tasks: clean(env.VITE_APPWRITE_TASKS_TABLE_ID),
    checklists: clean(env.VITE_APPWRITE_TASK_CHECKLISTS_TABLE_ID),
    comments: clean(env.VITE_APPWRITE_COMMENTS_TABLE_ID),
    notifications: clean(env.VITE_APPWRITE_NOTIFICATIONS_TABLE_ID),
    calendar: clean(env.VITE_APPWRITE_CALENDAR_EVENTS_TABLE_ID),
    conversations: clean(env.VITE_APPWRITE_AI_CONVERSATIONS_TABLE_ID),
    messages: clean(env.VITE_APPWRITE_AI_MESSAGES_TABLE_ID),
    activity: clean(env.VITE_APPWRITE_ACTIVITY_LOGS_TABLE_ID),
  },
  aiFunctionId: clean(env.VITE_APPWRITE_AI_FUNCTION_ID) || "",
  dataMode: clean(env.VITE_APPWRITE_DATA_MODE) || "local",
  geminiApiKey: clean(env.VITE_GEMINI_API_KEY) || "",
  geminiModel: clean(env.VITE_GEMINI_MODEL) || "gemini-2.5-flash",
};

export function validateAppwriteConfig() {
  const required = [
    ["VITE_APPWRITE_ENDPOINT", APPWRITE.endpoint],
    ["VITE_APPWRITE_PROJECT_ID", APPWRITE.projectId],
    ["VITE_APPWRITE_DATABASE_ID", APPWRITE.databaseId],
  ];
  const missing = required.filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing Appwrite environment variables: ${missing.join(", ")}`);
  }
  if (!/^https?:\/\//i.test(APPWRITE.endpoint)) {
    throw new Error("VITE_APPWRITE_ENDPOINT must be a valid http(s) URL.");
  }
}
