import { Conversation, Agent, UsageData, PieData, Notification, KnowledgeDoc, Task } from "../types";

export const CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Quarterly Report Analysis", lastMessage: "Here's the breakdown of Q3...", timestamp: new Date(Date.now() - 120000), pinned: true },
  { id: "2", title: "Marketing Strategy Draft", lastMessage: "Based on your target audience...", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", title: "Code Review: Auth Service", lastMessage: "I found 3 potential issues...", timestamp: new Date(Date.now() - 7200000) },
  { id: "4", title: "Competitor Research", lastMessage: "The top 5 competitors are...", timestamp: new Date(Date.now() - 86400000) },
  { id: "5", title: "Product Roadmap Q4", lastMessage: "I recommend prioritizing...", timestamp: new Date(Date.now() - 172800000) },
];

export const AGENTS: Agent[] = [
  { id: "1", name: "Data Analyst", description: "Analyzes datasets, creates visualizations, and generates insights from your data.", status: "online", capabilities: ["CSV Analysis", "Chart Generation", "Statistics"], color: "#6c63ff", avatar: "DA" },
  { id: "2", name: "Code Reviewer", description: "Reviews code for bugs, security vulnerabilities, and performance improvements.", status: "online", capabilities: ["Bug Detection", "Security Audit", "Refactoring"], color: "#00c2ff", avatar: "CR" },
  { id: "3", name: "Content Writer", description: "Creates compelling content for blogs, emails, social media, and marketing materials.", status: "busy", capabilities: ["Blog Posts", "Email Copy", "SEO Writing"], color: "#22c55e", avatar: "CW" },
  { id: "4", name: "Research Assistant", description: "Conducts in-depth research and compiles comprehensive reports on any topic.", status: "online", capabilities: ["Web Research", "Summarization", "Fact-checking"], color: "#f59e0b", avatar: "RA" },
  { id: "5", name: "Task Automator", description: "Automates repetitive tasks and workflows to boost your team's productivity.", status: "offline", capabilities: ["Workflow Design", "API Integration", "Scheduling"], color: "#ef4444", avatar: "TA" },
  { id: "6", name: "Document Parser", description: "Extracts, structures, and analyzes information from PDFs, Word docs, and more.", status: "online", capabilities: ["PDF Parsing", "Data Extraction", "OCR"], color: "#8b5cf6", avatar: "DP" },
];

export const USAGE_DATA: UsageData[] = [
  { day: "Mon", conversations: 24, tokens: 48000, tasks: 12 },
  { day: "Tue", conversations: 38, tokens: 72000, tasks: 19 },
  { day: "Wed", conversations: 31, tokens: 58000, tasks: 15 },
  { day: "Thu", conversations: 52, tokens: 104000, tasks: 28 },
  { day: "Fri", conversations: 45, tokens: 89000, tasks: 23 },
  { day: "Sat", conversations: 18, tokens: 32000, tasks: 8 },
  { day: "Sun", conversations: 29, tokens: 55000, tasks: 14 },
];

export const PIE_DATA: PieData[] = [
  { name: "Chat", value: 45, color: "#6c63ff" },
  { name: "Code", value: 28, color: "#00c2ff" },
  { name: "Docs", value: 15, color: "#22c55e" },
  { name: "Research", value: 12, color: "#f59e0b" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "success", title: "Report Generated", message: "Your Q3 analytics report is ready to download.", time: "2 min ago", read: false },
  { id: "2", type: "info", title: "Agent Update", message: "Code Reviewer agent has been updated to v2.1.", time: "1 hr ago", read: false },
  { id: "3", type: "warning", title: "Token Limit", message: "You've used 85% of your monthly token quota.", time: "3 hr ago", read: false },
  { id: "4", type: "success", title: "Document Processed", message: "competitive-analysis.pdf has been indexed.", time: "Yesterday", read: true },
  { id: "5", type: "info", title: "New Feature", message: "Split-screen mode is now available in the chat.", time: "2 days ago", read: true },
];

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  { id: "1", name: "Q3-Financial-Report.pdf", size: "2.4 MB", type: "pdf", uploaded: "Jul 5, 2026", status: "indexed" },
  { id: "2", name: "product-roadmap-2026.docx", size: "1.1 MB", type: "doc", uploaded: "Jul 4, 2026", status: "indexed" },
  { id: "3", name: "competitor-analysis.xlsx", size: "3.8 MB", type: "xls", uploaded: "Jul 3, 2026", status: "processing" },
  { id: "4", name: "brand-guidelines.pdf", size: "8.2 MB", type: "pdf", uploaded: "Jul 1, 2026", status: "indexed" },
  { id: "5", name: "engineering-specs.md", size: "156 KB", type: "md", uploaded: "Jun 28, 2026", status: "indexed" },
];

export const TASKS: Task[] = [
  { id: "1", title: "Generate Q3 performance report", priority: "high", status: "completed", due: "Jul 6, 2026", agent: "Data Analyst" },
  { id: "2", title: "Review authentication codebase", priority: "high", status: "in-progress", due: "Jul 8, 2026", agent: "Code Reviewer" },
  { id: "3", title: "Draft product launch email sequence", priority: "medium", status: "pending", due: "Jul 10, 2026", agent: "Content Writer" },
  { id: "4", title: "Research enterprise AI competitors", priority: "medium", status: "in-progress", due: "Jul 9, 2026", agent: "Research Assistant" },
  { id: "5", title: "Automate weekly digest workflow", priority: "low", status: "pending", due: "Jul 15, 2026", agent: "Task Automator" },
  { id: "6", title: "Parse and index product catalog", priority: "low", status: "completed", due: "Jul 5, 2026", agent: "Document Parser" },
];
