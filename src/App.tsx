import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./components/home";
import ArtifactsRepository from "./components/artifacts/ArtifactsRepository";
import FlakyTestAnalysis from "./components/flaky-tests/FlakyTestAnalysis";
import TeamCollaboration from "./components/collaboration/TeamCollaboration";
import VisualComparison from "./components/visual-comparison/VisualComparison";
import ManualTestExecution from "./components/manual-tests/ManualTestExecution";
import SettingsPage from "./components/settings/SettingsPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";

function AppContent() {
  const { isAuthenticated, login, signup, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/signup" element={<Signup onSignup={signup} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <div className="min-h-screen bg-background">
        <Navbar onLogout={logout} />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artifacts" element={<ArtifactsRepository />} />
          <Route path="/flaky-tests" element={<FlakyTestAnalysis />} />
          <Route path="/collaboration" element={<TeamCollaboration />} />
          <Route path="/visual-comparison" element={<VisualComparison />} />
          <Route path="/manual-tests" element={<ManualTestExecution />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
