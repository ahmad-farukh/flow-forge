import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import Tasks from "../pages/Tasks";
import TaskDetails from "../pages/TaskDetails";
import AIAssistant from "../pages/AIAssistant";
import Calendar from "../pages/Calendar";
import Team from "../pages/Team";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import MainLayout from "../components/layout/MainLayout";

function Protected() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="team" element={<Team />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default function AppRoutes({ authenticated }) {
  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={authenticated ? <Navigate to="/" replace /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/*" element={authenticated ? <Protected /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
