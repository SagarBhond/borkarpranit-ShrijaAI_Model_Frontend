// src/App.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { FilePreviewPanel } from "./components/layout/FilePreviewPanel";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { MessageCard, ChatInput } from "./components/chat";
import { Page, Message } from "./types";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import {
  AuthUser,
  getStoredUser,
  getToken,
  clearSession,
  sendChatMessage,
  ApiError,
} from "./lib/api";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanel, setRightPanel] = useState(false);
  const [splitScreen, setSplitScreen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getStoredUser());
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Shrija AI. How can I help you today?",
      timestamp: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages, isTyping]);
  const [chatSessionId, setChatSessionId] = useState<string | null>(
    () => localStorage.getItem("chatSessionId")
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = useCallback(() => {
    clearSession();
    setIsLoggedIn(false);
    setAuthUser(null);
    setChatSessionId(null);
    setMessages([
      { id: "1", role: "assistant", content: "Hello! I'm Shrija AI. How can I help you today?", timestamp: new Date() }
    ]);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const token = getToken();
    if (!token) {
      handleLogout();
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await sendChatMessage(token, content, chatSessionId);

      if (result.sessionId && result.sessionId !== chatSessionId) {
        setChatSessionId(result.sessionId);
        localStorage.setItem("chatSessionId", result.sessionId);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleLogout();
        return;
      }
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          err instanceof ApiError
            ? `Sorry, something went wrong: ${err.message}`
            : "Sorry, I can't reach the AI service right now. Is orchestrator-agent running on :8080?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [chatSessionId, handleLogout]);

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = () => {
    setShowResetPassword(true);
    setShowForgotPassword(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage onNavigate={setActivePage} />;
      case "chat":
        return (
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
              {messages.map(m => (
                <MessageCard key={m.id} msg={m} />
              ))}

              {isTyping && (
                <MessageCard
                  msg={{
                    id: "thinking",
                    role: "assistant",
                    content: "",
                    timestamp: new Date(),
                    thinking: true,
                  }}
                />
              )}

              {/* Scroll target */}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        );
      case "users":
        return authUser ? (
          <SignUp
            token={getToken() || ""}
            creatorRole={authUser.role}
            onCreated={() => { /* stay on the form so more accounts can be added */ }}
            onCancel={() => setActivePage("chat")}
          />
        ) : null;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background">
            <h2 className="text-xl font-bold capitalize">{activePage} Page</h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return <ForgotPassword onBackToLogin={handleBackToLogin} />;
    }
    if (showResetPassword) {
      return <ResetPassword onBackToLogin={handleBackToLogin} />;
    }
    return (
      <Login
        onLogin={() => {
          setAuthUser(getStoredUser());
          setIsLoggedIn(true);
        }}
        onForgotPasswordClick={handleForgotPassword}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        userRole={authUser?.role}
        userData={
          authUser
            ? { name: authUser.username, email: authUser.username, plan: authUser.role }
            : undefined
        }
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          activePage={activePage}
          onCommandPalette={() => { }}
          onNavigate={setActivePage}
          rightPanel={rightPanel}
          onRightPanel={() => setRightPanel(!rightPanel)}
          splitScreen={splitScreen}
          onSplitScreen={() => setSplitScreen(!splitScreen)}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="flex-1 flex overflow-hidden">
          {renderPage()}
          {rightPanel && <FilePreviewPanel onClose={() => setRightPanel(false)} />}
        </main>
      </div>
    </div>
  );
}
