import React, { createContext, useContext, useState, useEffect } from "react";

// Backend integration types - ready for Supabase or custom API
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "admin" | "user" | "viewer";
  organization?: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
    emailUpdates: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  // Backend integration helpers
  getAuthToken: () => string | null;
  refreshToken: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for existing session on app load
    // This is where you'd check localStorage/sessionStorage or make API call
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // TODO: Validate token with backend
          // const response = await fetch('/api/auth/verify', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          // }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      //
      // if (!response.ok) throw new Error('Login failed');
      //
      // const { user, token } = await response.json();
      // localStorage.setItem('auth_token', token);
      // setUser(user);

      // Mock user for development
      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
        role: "admin",
        organization: "Test Organization",
        preferences: {
          theme: "light",
          notifications: true,
          emailUpdates: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      //
      // if (!response.ok) throw new Error('Signup failed');
      //
      // const { user, token } = await response.json();
      // localStorage.setItem('auth_token', token);
      // setUser(user);

      // Mock user for development
      const mockUser: User = {
        id: "2",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "user",
        organization: data.organization,
        preferences: {
          theme: "light",
          notifications: true,
          emailUpdates: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      setUser(mockUser);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // TODO: Call logout endpoint
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${getAuthToken()}` }
      // });

      localStorage.removeItem("auth_token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(data)
      // });
      //
      // if (!response.ok) throw new Error('Profile update failed');
      //
      // const updatedUser = await response.json();
      // setUser(updatedUser);

      // Mock update for development
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("auth_token");
  };

  const refreshToken = async () => {
    try {
      // TODO: Implement token refresh
      // const response = await fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${getAuthToken()}` }
      // });
      //
      // if (response.ok) {
      //   const { token } = await response.json();
      //   localStorage.setItem('auth_token', token);
      // }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        getAuthToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
