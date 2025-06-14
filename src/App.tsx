import { Suspense, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ArtifactsRepository from "./components/artifacts/ArtifactsRepository";
import FlakyTestAnalysis from "./components/flaky-tests/FlakyTestAnalysis";
import TeamCollaboration from "./components/collaboration/TeamCollaboration";
import VisualComparison from "./components/visual-comparison/VisualComparison";
import ManualTestExecution from "./components/manual-tests/ManualTestExecution";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Navbar from "./components/layout/Navbar";
import routes from "tempo-routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    console.log("Login attempt:", { email, password });
    setIsAuthenticated(true);
  };

  const handleSignup = (data: any) => {
    // In a real app, you would create the account with your backend
    console.log("Signup attempt:", data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artifacts" element={<ArtifactsRepository />} />
          <Route path="/flaky-tests" element={<FlakyTestAnalysis />} />
          <Route path="/collaboration" element={<TeamCollaboration />} />
          <Route path="/visual-comparison" element={<VisualComparison />} />
          <Route path="/manual-tests" element={<ManualTestExecution />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
