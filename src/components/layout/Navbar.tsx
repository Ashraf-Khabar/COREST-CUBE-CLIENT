import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  TestTube,
  FileText,
  AlertTriangle,
  Users,
  Eye,
  Play,
  LogOut,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

interface NavbarProps {
  onLogout?: () => void;
}

export default function Navbar({ onLogout = () => {} }: NavbarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Dashboard", icon: TestTube },
    { path: "/artifacts", label: "Artifacts", icon: FileText },
    { path: "/flaky-tests", label: "Flaky Tests", icon: AlertTriangle },
    { path: "/collaboration", label: "Collaboration", icon: Users },
    { path: "/visual-comparison", label: "Visual Comparison", icon: Eye },
    { path: "/manual-tests", label: "Manual Tests", icon: Play },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <TestTube className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Test Insights Hub
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "bg-primary text-primary-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center space-x-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="hidden md:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </Button>

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md bg-muted">
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
