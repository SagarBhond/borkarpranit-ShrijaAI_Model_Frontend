// src/auth/Login.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Bot } from "lucide-react";
import { useState } from "react";
import { login, saveSession, ApiError } from "../lib/api";

interface LoginProps {
    onLogin: () => void;
    onForgotPasswordClick?: () => void;
}

export default function Login({ onLogin, onForgotPasswordClick }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            // The backend authenticates by "username" (an email address, e.g.
            // "admin@gmail.com") -- the email field here is sent as-is.
            const result = await login(email.trim(), password);

            saveSession(
                {
                    userId: result.userId,
                    username: result.username,
                    role: result.role,
                    employeeId: result.employeeId,
                },
                result.token
            );

            onLogin();
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Can't reach the server. Is auth-service running on :8081?");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">

            <Card className="w-full max-w-md shadow-xl">

                <CardHeader className="text-center">

                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="text-primary-foreground" />
                    </div>

                    <CardTitle className="text-3xl font-bold">
                        Shrija AI
                    </CardTitle>

                    <CardDescription>
                        Sign in to continue
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <a 
                                href="#" 
                                className="text-sm text-primary hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onForgotPasswordClick) onForgotPasswordClick();
                                }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting ? "Signing in..." : "Sign In"}
                        </Button>

                        {/* Accounts are provisioned by an Admin/HR/Manager, not
                            self-registered -- see auth-service AuthService.CREATABLE_ROLES */}
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account? Contact your administrator.
                        </p>

                    </form>

                </CardContent>

            </Card>

        </div>
    );
}
