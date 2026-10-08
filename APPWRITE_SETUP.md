# FlowForge — Appwrite setup

## 1. Frontend `.env`

Copy `.env.example` to `.env` and keep the Appwrite IDs from your own Appwrite project.

Do not change the endpoint to another region unless the Appwrite project actually belongs to that region.

## 2. Authentication

In Appwrite Console:
- Open the FlowForge project.
- Authentication → Providers.
- Enable Email/Password.

The app's login/signup flow uses Appwrite Account only. A database/profile-table failure must not prevent authentication.

## 3. TablesDB

The database and table IDs in `.env` must belong to the same Appwrite project.

For every table used by the frontend, configure permissions intentionally. Appwrite grants no access by default. For client-side row creation, the table needs CREATE permission for the authenticated users who are allowed to create rows. READ/UPDATE/DELETE can be restricted with row security and row-level permissions.

For the `profiles` table, if you enable Row Security, grant authenticated users CREATE at table level and set per-row READ/UPDATE/DELETE permissions when creating a profile.

## 4. Important 404 rule

A 404 from Appwrite normally means the requested resource cannot be found. Check these values first:

- endpoint/region
- project ID
- database ID
- table ID
- bucket ID
- function ID

Do not replace an ID with a guessed value.

## 5. Frontend security

Never put an Appwrite API key, OpenAI key, Gemini key, or other server secret in Vite `VITE_*` variables. The frontend must use the public Appwrite project ID and client SDK. Server secrets belong in an Appwrite Function or another backend.
