export type Page = "dashboard" | "chat" | "agents" | "knowledge" | "projects" | "tasks" | "analytics" | "reports" | "notifications" | "settings" | "profile" | "users";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  thinking?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  pinned?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  capabilities: string[];
  color: string;
  avatar: string;
}

export interface UsageData {
  day: string;
  conversations: number;
  tokens: number;
  tasks: number;
}

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  uploaded: string;
  status: "indexed" | "processing";
}

export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "pending";
  due: string;
  agent: string;
}
