// src/auth/SignUp.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "../components/ui/card";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
    Eye,
    EyeOff,
    UserPlus,
    CheckCircle,
    XCircle,
} from "lucide-react";

import { useState, type ReactNode } from "react";

import { createUser, ApiError, Role } from "../lib/api";

const FormLabel = ({
    htmlFor,
    children,
    required = false,
}: {
    htmlFor: string;
    children: ReactNode;
    required?: boolean;
}) => (
    <Label htmlFor={htmlFor}>
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
);

interface SignUpProps {
    token: string;
    creatorRole: Role;
    onCreated: () => void;
    onCancel: () => void;
}

const CREATABLE_ROLES: Record<Role, Role[]> = {
    ADMIN: ["MANAGER", "HR", "EMPLOYEE"],
    MANAGER: ["HR", "EMPLOYEE"],
    HR: ["EMPLOYEE"],
    EMPLOYEE: [],
};

export default function SignUp({
    token,
    creatorRole,
    onCreated,
    onCancel,
}: SignUpProps) {
    const assignableRoles = CREATABLE_ROLES[creatorRole] ?? [];

    // Basic user information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    // Employee information
    const [role, setRole] = useState<Role | "">(
        assignableRoles[0] ?? ""
    );
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [managerEmployeeId, setManagerEmployeeId] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");

    // Password
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [errors, setErrors] = useState<{
        firstName?: string;
        email?: string;
        role?: string;
        managerEmployeeId?: string;
        dateOfJoining?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validatePassword = (pass: string) => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasMinLength = pass.length >= 8;

        return {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasMinLength,
        };
    };

    const passwordValidation = validatePassword(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        setSuccessMessage("");

        const newErrors: typeof errors = {};

        // First name
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email =
                "Please enter a valid email address";
        }

        // Role
        if (!role) {
            newErrors.role = "Role is required";
        }

        // Manager Employee ID
        if (
            managerEmployeeId.trim() &&
            !/^\d+$/.test(managerEmployeeId.trim())
        ) {
            newErrors.managerEmployeeId =
                "Manager Employee ID must be a number";
        }

        // Date of joining
        if (dateOfJoining) {
            const joiningDate = new Date(dateOfJoining);

            if (Number.isNaN(joiningDate.getTime())) {
                newErrors.dateOfJoining =
                    "Please enter a valid date of joining";
            }
        }

        // Password
        if (!password) {
            newErrors.password = "Password is required";
        } else if (!passwordValidation.hasMinLength) {
            newErrors.password =
                "Password must be at least 8 characters";
        } else if (!passwordValidation.hasUpperCase) {
            newErrors.password =
                "Password must contain at least one uppercase letter";
        } else if (!passwordValidation.hasLowerCase) {
            newErrors.password =
                "Password must contain at least one lowercase letter";
        } else if (!passwordValidation.hasNumber) {
            newErrors.password =
                "Password must contain at least one number";
        }

        // Confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm the password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        // Stop if validation fails
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        try {
            await createUser(token, {
                username: email.trim(),
                password,
                role: role as Role,
                firstName: firstName.trim(),

                lastName:
                    lastName.trim() || undefined,

                department:
                    department.trim() || undefined,

                designation:
                    designation.trim() || undefined,

                managerEmployeeId:
                    managerEmployeeId.trim()
                        ? Number(managerEmployeeId.trim())
                        : undefined,

                dateOfJoining:
                    dateOfJoining || undefined,
            });

            setSuccessMessage(
                `Account created for ${email.trim()}.`
            );

            // Reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setRole(assignableRoles[0] ?? "");
            setDepartment("");
            setDesignation("");
            setManagerEmployeeId("");
            setDateOfJoining("");
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            onCreated();
        } catch (err) {
            setServerError(
                err instanceof ApiError
                    ? err.message
                    : "Could not create the account"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // User does not have permission to create accounts
    if (assignableRoles.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle>
                            Not permitted
                        </CardTitle>

                        <CardDescription>
                            Your role ({creatorRole}) isn't
                            allowed to create new accounts.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center p-4 bg-background">

            <Card className="w-full max-w-2xl shadow-xl flex flex-col max-h-[85vh]">

                {/* Header */}
                <CardHeader className="text-center shrink-0 pb-4">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                        <UserPlus className="text-primary-foreground" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Create Account
                    </CardTitle>
                    <CardDescription>
                        Provision a new login (as {creatorRole})
                    </CardDescription>
                </CardHeader>

                {/* Form Content */}
                <CardContent className="flex-1 min-h-0 overflow-y-auto p-6">

                    <form
                        id="signup-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Row 1: First Name & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormLabel
                                    htmlFor="firstName"
                                    required
                                >
                                    First Name
                                </FormLabel>

                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);

                                        if (errors.firstName) {
                                            setErrors({
                                                ...errors,
                                                firstName: undefined,
                                            });
                                        }
                                    }}
                                    className={
                                        errors.firstName
                                            ? "border-red-500"
                                            : ""
                                    }
                                />

                                {errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="lastName">
                                    Last Name
                                </FormLabel>

                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Row 2: Email */}
                        <div className="space-y-2">

                            <FormLabel
                                htmlFor="email"
                                required
                            >
                                Email (used as username)
                            </FormLabel>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                    if (errors.email) {
                                        setErrors({
                                            ...errors,
                                            email: undefined,
                                        });
                                    }
                                }}
                                className={
                                    errors.email
                                        ? "border-red-500"
                                        : ""
                                }
                            />

                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}

                        </div>

                        {/* Row 3: Role */}
                        <div className="space-y-2">

                            <FormLabel
                                htmlFor="role"
                                required
                            >
                                Role
                            </FormLabel>

                            <select
                                id="role"
                                value={role}
                                onChange={(e) => {
                                    setRole(
                                        e.target.value as Role
                                    );

                                    if (errors.role) {
                                        setErrors({
                                            ...errors,
                                            role: undefined,
                                        });
                                    }
                                }}
                                className={`w-full h-10 rounded-md border bg-transparent px-3 text-sm ${errors.role
                                    ? "border-red-500"
                                    : "border-input"
                                    }`}
                            >
                                <option
                                    value=""
                                    disabled
                                >
                                    Select a role
                                </option>

                                {assignableRoles.map((r) => (
                                    <option
                                        key={r}
                                        value={r}
                                    >
                                        {r}
                                    </option>
                                ))}
                            </select>

                            {errors.role && (
                                <p className="text-sm text-red-500">
                                    {errors.role}
                                </p>
                            )}

                        </div>

                        {/* Row 4: Department & Designation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2">

                                <Label htmlFor="department">
                                    Department
                                </Label>

                                <Input
                                    id="department"
                                    placeholder="e.g. Engineering"
                                    value={department}
                                    onChange={(e) =>
                                        setDepartment(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="designation">
                                    Designation
                                </Label>

                                <Input
                                    id="designation"
                                    placeholder="e.g. Software Engineer"
                                    value={designation}
                                    onChange={(e) =>
                                        setDesignation(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* Row 5: Manager Employee ID & Date of Joining */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">

                                <FormLabel htmlFor="managerEmployeeId">
                                    Manager Employee ID
                                </FormLabel>

                                <Input
                                    id="managerEmployeeId"
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 101"
                                    value={managerEmployeeId}
                                    onChange={(e) => {
                                        setManagerEmployeeId(
                                            e.target.value
                                        );

                                        if (
                                            errors.managerEmployeeId
                                        ) {
                                            setErrors({
                                                ...errors,
                                                managerEmployeeId:
                                                    undefined,
                                            });
                                        }
                                    }}
                                    className={
                                        errors.managerEmployeeId
                                            ? "border-red-500"
                                            : ""
                                    }
                                />

                                {errors.managerEmployeeId && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.managerEmployeeId
                                        }
                                    </p>
                                )}

                            </div>
                            <div className="space-y-2">
                                <FormLabel htmlFor="dateOfJoining">
                                    Date of Joining
                                </FormLabel>

                                <div className="relative">
                                    <Input
                                        id="dateOfJoining"
                                        type="date"
                                        value={dateOfJoining}
                                        onClick={(e) => {
                                            // Opens the calendar popup when the input box is clicked
                                            try {
                                                e.currentTarget.showPicker();
                                            } catch {
                                                // Fallback for browsers that do not support showPicker
                                            }
                                        }}
                                        onChange={(e) => {
                                            setDateOfJoining(e.target.value);
                                            if (errors.dateOfJoining) {
                                                setErrors({
                                                    ...errors,
                                                    dateOfJoining: undefined,
                                                });
                                            }
                                        }}
                                        className={`w-full cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 ${errors.dateOfJoining ? "border-red-500" : ""
                                            }`}
                                    />
                                </div>

                                {errors.dateOfJoining && (
                                    <p className="text-sm text-red-500">
                                        {errors.dateOfJoining}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Row 6: Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Password */}
                            <div className="space-y-2">

                                <FormLabel
                                    htmlFor="password"
                                    required
                                >
                                    Temporary Password
                                </FormLabel>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(
                                                e.target.value
                                            );

                                            if (
                                                errors.password
                                            ) {
                                                setErrors({
                                                    ...errors,
                                                    password:
                                                        undefined,
                                                });
                                            }
                                        }}
                                        className={
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-2.5 text-muted-foreground"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                                {/* Password Requirements */}
                                {password && (
                                    <div className="space-y-1 mt-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            {passwordValidation.hasMinLength ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}

                                            <span
                                                className={
                                                    passwordValidation.hasMinLength
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }
                                            >
                                                At least 8 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {passwordValidation.hasUpperCase ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}

                                            <span
                                                className={
                                                    passwordValidation.hasUpperCase
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }
                                            >
                                                Uppercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {passwordValidation.hasLowerCase ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}

                                            <span
                                                className={
                                                    passwordValidation.hasLowerCase
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }
                                            >
                                                Lowercase letter
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {passwordValidation.hasNumber ? (
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            ) : (
                                                <XCircle
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            )}

                                            <span
                                                className={
                                                    passwordValidation.hasNumber
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                }
                                            >
                                                Number
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">

                                <FormLabel
                                    htmlFor="confirmPassword"
                                    required
                                >
                                    Confirm Password
                                </FormLabel>

                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) => {
                                            setConfirmPassword(
                                                e.target.value
                                            );

                                            if (
                                                errors.confirmPassword
                                            ) {
                                                setErrors({
                                                    ...errors,
                                                    confirmPassword:
                                                        undefined,
                                                });
                                            }
                                        }}
                                        className={
                                            errors.confirmPassword
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-2.5 text-muted-foreground"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.confirmPassword
                                        }
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <p className="text-sm text-red-500 text-center">
                                {serverError}
                            </p>
                        )}

                        {/* Success message */}
                        {successMessage && (
                            <p className="text-sm text-green-500 text-center">
                                {successMessage}
                            </p>
                        )}

                    </form>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-6 border-t bg-muted/20 shrink-0 flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="px-6"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="signup-form"
                        disabled={submitting}
                        className="px-6"
                    >
                        {submitting
                            ? "Creating..."
                            : "Create Account"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}