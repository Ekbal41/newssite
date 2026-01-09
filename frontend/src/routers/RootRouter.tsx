import { Routes, Route } from "react-router";
import LandingPage from "@/pages/root/LandingPage";
import { NewsFeed } from "@/components/NewsFeed";
import { ArticleDetail } from "@/components/ArticleDetail";
import { JournalistDashboard } from "@/components/JournalistDashboard";
import { FactCheckerDashboard } from "@/components/FactCheckerDashboard";
import { EditorDashboard } from "@/components/EditorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import AppLayout from "@/components/layouts/AppLayout";

import Dashboard from "@/pages/user/Dashboard";
import Account from "@/pages/user/Account";
import LoginRegister from "@/pages/auth/LoginRegister";

export default function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/news" element={<NewsFeed />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/auth" element={<LoginRegister />} />
      <Route path="/auth/login" element={<LoginRegister />} />
      <Route path="/auth/register" element={<LoginRegister />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/journalist" element={<JournalistDashboard />} />
          <Route path="/fact-checker" element={<FactCheckerDashboard />} />
          <Route path="/editor" element={<EditorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
