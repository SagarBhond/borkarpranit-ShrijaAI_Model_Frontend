// src/auth/ForgotPassword.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Bot, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Check if user exists in localStorage (from sign up)
            const userData = localStorage.getItem("userData");
            if (userData) {
                const user = JSON.parse(userData);
                if (user.email === email) {
                    // In a real app, this would send an email
                    console.log(`Password reset link sent to ${email}`);
                    setIsSubmitted(true);
                } else {
                    setError("No account found with this email address");
                }
            } else {
                // If no user data exists, still show success for security
                // (don't reveal if email exists or not)
                console.log(`Password reset link sent to ${email}`);
                setIsSubmitted(true);
            }
            setIsLoading(false);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background px-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Check Your Email
                        </CardTitle>
                        <CardDescription>
                            We've sent a password reset link to
                            <br />
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            If you don't see the email, check your spam folder or
                            <br />
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail("");
                                }}
                                className="text-primary hover:underline font-medium"
                            >
                                try again with a different email
                            </button>
                        </p>
                        <Button
                            onClick={onBackToLogin}
                            className="w-full"
                        >
                            Back to Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                className={error ? "border-red-500" : ""}
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Sending...
                                </div>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onBackToLogin}
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}