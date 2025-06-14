import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TestTube,
  FileText,
  AlertTriangle,
  Users,
  Eye,
  Play,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  onLogout?: () => void;
}

export default function Navbar({ onLogout = () => {} }: NavbarProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: TestTube },
    { path: "/artifacts", label: "Artifacts", icon: FileText },
    { path: "/flaky-tests", label: "Flaky Tests", icon: AlertTriangle },
    { path: "/collaboration", label: "Collaboration", icon: Users },
    { path: "/visual-comparison", label: "Visual Comparison", icon: Eye },
    { path: "/manual-tests", label: "Manual Tests", icon: Play },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <TestTube className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">
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
    </nav>
  );
}
