import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import projects from "./slices/projectSlice";
import tasks from "./slices/taskSlice";
import team from "./slices/teamSlice";
import notifications from "./slices/notificationSlice";
import ai from "./slices/aiSlice";
import ui from "./slices/uiSlice";

export const store = configureStore({
  reducer: { auth, projects, tasks, team, notifications, ai, ui },
  devTools: import.meta.env.DEV
});
