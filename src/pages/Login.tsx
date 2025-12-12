/**
 * Login Page Component
 *
 * User authentication and login interface:
 * - Email/password login form
 * - New account registration
 * - Form validation and error handling
 * - Session persistence with localStorage
 * - Redirect to dashboard on successful login
 */

// React hooks
import { useState } from "react";

// React Router navigation
import { useNavigate } from "react-router-dom";

// UI components from shadcn
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hooks and state
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/gameStore";

// Icons from lucide-react
import { LogIn, UserPlus, AlertCircle } from "lucide-react";

/**
 * Mock user database for authentication
 * In production, this would be replaced with API calls to backend
 */
const MOCK_USERS = [
  {
    id: "user-1",
    email: "student@example.com",
    password: "password123",
    name: "Student",
  },
  {
    id: "user-2",
    email: "learner@example.com",
    password: "learning456",
    name: "Learner",
  },
];

/**
 * Login Component
 *
 * Provides authentication with:
 * - Login form for existing users
 * - Registration form for new accounts
 * - Email validation
 * - Session persistence
 * - Automatic redirect on success
 */
export default function Login() {
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser, setUser } = useGameStore();

  // Tab state (login or register)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Registration form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  /**
   * Validate email format
   *
   * @param email - Email address to validate
   * @returns {boolean} True if email is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle login form submission
   * Validates credentials and creates session
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(loginEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoginLoading(true);

    // Simulate API call with 1-second delay
    setTimeout(() => {
      // Check credentials against mock database
      const user = MOCK_USERS.find(
        (u) => u.email === loginEmail && u.password === loginPassword
      );

      if (user) {
        // Store authentication session
        localStorage.setItem(
          "auth-session",
          JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString(),
          })
        );

        // Update game store with user info
        setUser({
          name: user.name,
          email: loginEmail,
        });

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });

        // Dispatch custom event to notify App of auth change
        window.dispatchEvent(new Event("auth-changed"));

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast({
          title: "Login failed",
          description:
            "Invalid email or password. Try user@example.com / password123",
          variant: "destructive",
        });
      }

      setIsLoginLoading(false);
    }, 1000);
  };

  /**
   * Handle registration form submission
   * Creates new account with provided credentials
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (
      !registerEmail ||
      !registerPassword ||
      !registerName ||
      !confirmPassword
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(registerEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (MOCK_USERS.some((u) => u.email === registerEmail)) {
      toast({
        title: "Email already registered",
        description: "This email is already associated with an account.",
        variant: "destructive",
      });
      return;
    }

    setIsRegisterLoading(true);

    // Simulate API call with 1-second delay
    setTimeout(() => {
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: registerEmail,
        password: registerPassword,
        name: registerName,
      };

      // In real app, this would be saved to backend
      MOCK_USERS.push(newUser);

      // Store authentication session
      localStorage.setItem(
        "auth-session",
        JSON.stringify({
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
          loginTime: new Date().toISOString(),
        })
      );

      // Update game store with user info
      setUser({
        name: newUser.name,
        email: registerEmail,
      });

      toast({
        title: "Account created",
        description: `Welcome, ${registerName}! Your account has been created.`,
      });

      // Dispatch custom event to notify App of auth change
      window.dispatchEvent(new Event("auth-changed"));

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 500);

      setIsRegisterLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">📚 Graspify</h1>
          <p className="text-blue-100 text-lg">Your AI Learning Companion</p>
        </div>

        {/* Card */}
        <Card className="w-full shadow-2xl border-0">
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "register")}
            >
              {/* Tab Triggers */}
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="student@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoginLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoginLoading}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                    <p className="font-semibold text-blue-900 mb-1">
                      Demo Credentials:
                    </p>
                    <p className="text-blue-800">📧 student@example.com</p>
                    <p className="text-blue-800">🔐 password123</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="student@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isRegisterLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
