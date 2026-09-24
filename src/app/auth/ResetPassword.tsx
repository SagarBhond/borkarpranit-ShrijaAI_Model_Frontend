// src/auth/ResetPassword.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Bot, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ResetPasswordProps {
    onBackToLogin: () => void;
}

export default function ResetPassword({ onBackToLogin }: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    // Password validation
    const validatePassword = (pass: string) => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasMinLength = pass.length >= 8;
        return { hasUpperCase, hasLowerCase, hasNumber, hasMinLength };
    };

    const passwordValidation = validatePassword(newPassword);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        // Validate new password
        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase || !passwordValidation.hasNumber) {
            newErrors.newPassword = "Password must contain uppercase, lowercase, and number";
        }

        // Validate confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Simulate API call to update password
        setTimeout(() => {
            // Update password in localStorage
            const userData = localStorage.getItem("userData");
            if (userData) {
                const user = JSON.parse(userData);
                user.password = newPassword;
                localStorage.setItem("userData", JSON.stringify(user));
            }
            setIsSubmitted(true);
        }, 1000);
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
                            Password Reset Successful
                        </CardTitle>
                        <CardDescription>
                            Your password has been successfully reset.
                            <br />
                            You can now sign in with your new password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={onBackToLogin} className="w-full">
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
                        Create New Password
                    </CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) {
                                            setErrors({ ...errors, newPassword: undefined });
                                        }
                                    }}
                                    className={errors.newPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword}</p>
                            )}

                            {/* Password Strength Indicators */}
                            {newPassword && (
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasMinLength ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasMinLength ? "text-green-500" : "text-gray-400"}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasUpperCase ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasUpperCase ? "text-green-500" : "text-gray-400"}>
                                            Uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasLowerCase ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasLowerCase ? "text-green-500" : "text-gray-400"}>
                                            Lowercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasNumber ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasNumber ? "text-green-500" : "text-gray-400"}>
                                            Number
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: undefined });
                                        }
                                    }}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>

                        {/* Back to Sign In - CORRECTED VERSION */}
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