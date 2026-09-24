// src/components/layout/Sidebar.tsx
import React, { useState } from "react";
import { 
  LayoutDashboard, MessageSquare, Bot, Database, FolderKanban, 
  CheckSquare, BarChart2, FileText, Settings, LogOut, ChevronLeft, 
  ChevronRight, Zap, User, HelpCircle, Sparkles, Crown, UserCircle,
  ChevronDown, ChevronUp, UserPlus
} from "lucide-react";
import { Page } from "../../types";
import { canCreateUsers, Role } from "../../lib/api";

interface SidebarProps {
  activePage: Page;
  onNavigate: (p: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  userRole?: Role;
  userData?: {
    name: string;
    email: string;
    plan?: string;
  };
}

export const Sidebar = ({ 
  activePage, 
  onNavigate, 
  collapsed, 
  onToggle,
  onLogout,
  userRole,
  userData = { name: "Admin", email: "admin@shrija.com", plan: "Free" }
}: SidebarProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const MENU_ITEMS = [
    { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { id: "chat", icon: <MessageSquare size={18} />, label: "AI Chat" },
    { id: "agents", icon: <Bot size={18} />, label: "AI Agents" },
    { id: "knowledge", icon: <Database size={18} />, label: "Knowledge" },
    { id: "projects", icon: <FolderKanban size={18} />, label: "Projects" },
    { id: "tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { id: "analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
    { id: "reports", icon: <FileText size={18} />, label: "Reports" },
    ...(canCreateUsers(userRole)
      ? [{ id: "users", icon: <UserPlus size={18} />, label: "Create User" }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    if (onLogout) {
      onLogout();
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={`relative h-screen border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out bg-sidebar ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 mb-2">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-background fill-background" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-lg tracking-tight text-foreground">
            Shrija<span className="opacity-70">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activePage === item.id 
                ? "bg-sidebar-accent text-sidebar-foreground" 
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <div className={`${activePage === item.id ? "text-sidebar-foreground" : "group-hover:text-sidebar-foreground"}`}>
              {item.icon}
            </div>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-sidebar-border">
        {!collapsed ? (
          // Expanded view - Full profile with dropdown
          <div className="p-3">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-xs flex-shrink-0">
                  {getInitials(userData.name)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {userData.plan || "Free"}
                  </p>
                </div>
                {isProfileOpen ? (
                  <ChevronUp size={16} className="text-sidebar-foreground/60" />
                ) : (
                  <ChevronDown size={16} className="text-sidebar-foreground/60" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-sidebar border border-sidebar-border rounded-lg shadow-lg py-1 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-sidebar-border">
                    <p className="text-sm font-medium text-foreground">{userData.name}</p>
                    <p className="text-xs text-sidebar-foreground/60">{userData.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                  >
                    <UserCircle size={16} />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      onNavigate("settings");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      // Upgrade plan logic
                      alert("Upgrade plan coming soon!");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                  >
                    <Crown size={16} className="text-amber-500" />
                    <span>Try Plus</span>
                    <span className="ml-auto text-xs text-amber-500">Free</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                  >
                    <HelpCircle size={16} />
                    Help
                  </button>
                  
                  <div className="border-t border-sidebar-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Collapsed view - Just avatar with hover tooltip
          <div className="p-2">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center justify-center px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-all relative group"
            >
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-xs">
                {getInitials(userData.name)}
              </div>
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {userData.name}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-sidebar-border bg-sidebar flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};