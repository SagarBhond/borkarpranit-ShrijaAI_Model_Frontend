// src/app/lib/api.ts
//
// Talks to two backend services:
//   - Auth Service (Spring Boot)        -> http://localhost:8081/api/auth
//   - Orchestrator Agent (Spring Boot)  -> http://localhost:8080/api/v1/orchestrator
//
// The Auth Service issues an HS256 JWT on login (see AuthController/AuthService).
// That same token is sent as "Authorization: Bearer <token>" on every
// Orchestrator call and on every privileged Auth Service call (create user, /me).
//
// NOTE (backend changes needed -- see chat writeup):
//   1. auth-service must allow CORS from this dev origin (http://localhost:3000).
//      It already does via @CrossOrigin(origins = "${auth.cors.allowed-origin}").
//   2. orchestrator-agent currently has NO CORS config at all, and its
//      JwtAuthenticationFilter runs on every /api/* request including CORS
//      preflight OPTIONS calls, which have no Authorization header and would
//      get rejected with 401. Add a CorsConfigurationSource + let the filter's
//      shouldNotFilter() skip OPTIONS requests.

const AUTH_BASE = "http://localhost:8081/api/auth";
const ORCHESTRATOR_BASE = "http://localhost:8080/api/v1/orchestrator";

export type Role = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";

// Mirrors AuthService.CREATABLE_ROLES on the backend, so the UI never offers
// a role the backend would reject.
const CREATABLE_ROLES: Record<Role, Role[]> = {
  ADMIN: ["MANAGER", "HR", "EMPLOYEE"],
  MANAGER: ["HR", "EMPLOYEE"],
  HR: ["EMPLOYEE"],
  EMPLOYEE: [],
};

export function canCreateUsers(role?: Role | null): boolean {
  return !!role && CREATABLE_ROLES[role].length > 0;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    // Auth Service returns { message }, Orchestrator's exception handler
    // returns { error } (see OrchestratorExceptionHandler / JwtAuthenticationFilter).
    return body.message || body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

async function readJsonOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Session storage
// ---------------------------------------------------------------------------

export interface AuthUser {
  userId: number;
  username: string;
  role: Role;
  employeeId: number | null;
}

export function saveSession(user: AuthUser, token: string) {
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("chatSessionId");
}

export function getToken(): string | null {
  return localStorage.getItem("authToken");
}

export function getStoredUser(): AuthUser | null {
  const saved = localStorage.getItem("authUser");
  return saved ? (JSON.parse(saved) as AuthUser) : null;
}

// ---------------------------------------------------------------------------
// Auth Service: login / create user / me
// ---------------------------------------------------------------------------

export interface LoginResult {
  userId: number;
  username: string;
  role: Role;
  employeeId: number | null;
  message: string;
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return readJsonOrThrow<LoginResult>(response);
}

export interface CreateUserPayload {
  username: string; // email
  password: string;
  role: Role;
  firstName: string;
  lastName?: string;
  department?: string;
  designation?: string;
  managerEmployeeId?: number | null;
  dateOfJoining?: string | null; // "YYYY-MM-DD"
}

export interface UserResponse {
  userId: number;
  username: string;
  role: Role;
  employeeId: number | null;
}

// Creates a new login (ADMIN -> MANAGER/HR/EMPLOYEE, MANAGER -> HR/EMPLOYEE,
// HR -> EMPLOYEE). Requires the *caller* to already be signed in as one of
// those roles -- there is no public self-signup on the backend.
export async function createUser(
  token: string,
  payload: CreateUserPayload
): Promise<UserResponse> {
  const response = await fetch(`${AUTH_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return readJsonOrThrow<UserResponse>(response);
}

export async function getCurrentUser(token: string): Promise<UserResponse> {
  const response = await fetch(`${AUTH_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return readJsonOrThrow<UserResponse>(response);
}

// ---------------------------------------------------------------------------
// Orchestrator Agent: chat
// ---------------------------------------------------------------------------

export interface ChatResult {
  sessionId: string;
  responseText: string;
}

// sessionId: pass null on the first message of a conversation; the
// orchestrator creates one and returns it in the response. Pass that same
// sessionId back on every following message so the agent keeps context.
export async function sendChatMessage(
  token: string,
  message: string,
  sessionId: string | null
): Promise<ChatResult> {
  const response = await fetch(`${ORCHESTRATOR_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, message }),
  });
  return readJsonOrThrow<ChatResult>(response);
}
