# FlowForge

FlowForge is a React + Appwrite project-management dashboard built around Appwrite TablesDB, Storage and Account authentication.

## Stack

- React 19
- Vite 7
- React Router DOM 7
- Redux Toolkit
- React Hook Form
- Appwrite Web SDK 21
- CSS responsive UI

## Setup

1. Copy `.env.example` to `.env`.
2. Keep the Appwrite values for your project in `.env`.
3. Run `npm install`.
4. Run `npm run dev`.

## Appwrite platform

In Appwrite Console, add a Web platform for `localhost` during local development. Use the exact endpoint and project ID from your Appwrite project.

## Tables

The frontend expects these tables from the supplied schema:

- profiles
- projects
- project_members
- tasks
- task_checklists
- comments
- notifications
- calendar_events
- ai_conversations
- ai_messages
- activity_logs

## Permissions

The app uses row-level permissions when creating private user-owned rows. Row Security must be enabled for those row permissions to have effect. The relevant table-level permissions must still allow the operations your UI performs (for example, authenticated users need Create on tables where the browser creates rows, and Read on tables they query). Appwrite documents that table-level and row-level permissions work together and that users need a granted permission at either level to access a row.

For production, keep the least-privilege model. Do not add an Appwrite API key to Vite environment variables. Server/API keys must stay in an Appwrite Function or other server-side environment.

## AI

The AI page has a safe local fallback. For real AI, set `VITE_APPWRITE_AI_FUNCTION_ID` to an Appwrite Function that calls your provider server-side. Do not put an OpenAI or Gemini secret key in this frontend.

## Troubleshooting Appwrite 404

A 404 from Appwrite normally means the requested resource ID/endpoint is wrong or the resource does not exist in the selected project. Verify the endpoint, project ID, database ID, table IDs and bucket ID in `.env` against the Appwrite Console. The app now preserves Appwrite error messages so the browser UI shows the actual API error instead of hiding it.

## FlowForge data mode

The project now defaults to `VITE_APPWRITE_DATA_MODE=local`. Authentication still uses Appwrite Account, while projects, tasks, team, notifications, calendar, comments and profile data use a fast browser-local store. This prevents Appwrite TablesDB permission errors from breaking the UI while you finish configuring table permissions.

After configuring every table's required permissions and indexes in Appwrite, change the variable to `VITE_APPWRITE_DATA_MODE=appwrite` to use TablesDB.

## Gemini AI
Set these in `.env`:

```env
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash
```

The AI page first tries an Appwrite Function when `VITE_APPWRITE_AI_FUNCTION_ID` is configured, then Gemini, then a local fallback. Gemini's REST `generateContent` endpoint accepts the API key in the `x-goog-api-key` header. For production, do not expose a privileged Gemini key in a public browser bundle; proxy the request through an Appwrite Function/server and keep the secret server-side.

## FlowForge User ID
Every authenticated Appwrite account already has a unique `$id`. FlowForge displays that ID in Team and Settings. In local data mode, profiles are also indexed in the browser's local directory so accounts created in the same browser can be found by User ID. For cross-device/team collaboration, use Appwrite data mode and grant the profiles table the appropriate read permission.

## Final setup notes (AI, uploads, deployment)

### Gemini AI
The AI assistant requires a Gemini API key. Create one at https://aistudio.google.com/apikey and add it to your local `.env`:

```env
VITE_GEMINI_API_KEY=your_actual_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash
```

Stop and restart Vite after changing `.env` (`Ctrl+C`, then `npm run dev`). Without a key the app intentionally shows a clear configuration error instead of pretending a canned response came from AI. A `VITE_` key is bundled into browser code, so use an Appwrite Function/server-side proxy with a server-only secret for a public production deployment.

### Project files
In local data mode, file metadata is stored in local storage and file bytes are stored in IndexedDB so uploads survive page refreshes in the same browser. Local-mode files are browser/device-specific and are not shared across team members or devices. For shared production files, set `VITE_APPWRITE_DATA_MODE=appwrite`, configure the Appwrite Storage bucket and permissions, then redeploy.

### Logo and theme
The provided FlowForge logo is stored at `public/flowforge-logo.png` and used in the application sidebar. Dark mode uses a black/white palette with red primary buttons; calendar navigation controls retain explicit contrast in dark mode.

### Deploy to Vercel
1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**; build command: `npm run build`; output directory: `dist`.
4. Add the required Appwrite environment variables in **Project Settings → Environment Variables**. Add Gemini configuration only if using it; prefer an Appwrite Function for the secret key in production.
5. Deploy. For client-side routes, add `vercel.json` with a rewrite from all paths to `/index.html` if deep links return 404.

### Deploy to Render (Static Site)
1. Push the project to GitHub and create a **Static Site** in Render.
2. Build command: `npm install && npm run build`; publish directory: `dist`.
3. Add the same environment variables in Render's environment settings.
4. Add a rewrite rule `/*` → `/index.html` with action **Rewrite** so React Router routes work on refresh.

**Important:** Local data mode is browser-local storage, not a shared production database. For multiple users to see the same projects/files/team data, configure Appwrite TablesDB and Storage permissions and switch `VITE_APPWRITE_DATA_MODE=appwrite` after verifying the schema.
