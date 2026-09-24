import React from "react";
import { Search, Command, SplitSquareHorizontal, PanelRight, Sun, Moon, Bell } from "lucide-react";
import { Page } from "../../types";

interface NavbarProps {
  activePage: Page;
  onCommandPalette: () => void;
  onNavigate: (p: Page) => void;
  rightPanel: boolean;
  onRightPanel: () => void;
  splitScreen: boolean;
  onSplitScreen: () => void;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const Navbar = ({
  activePage,
  onCommandPalette,
  onNavigate,
  rightPanel,
  onRightPanel,
  splitScreen,
  onSplitScreen,
  theme,
  setTheme,
}: NavbarProps) => {
  const PAGE_LABELS: Record<Page, string> = {
    dashboard: "Dashboard", chat: "AI Chat", agents: "AI Agents",
    knowledge: "Knowledge Base", projects: "Projects", tasks: "Tasks",
    analytics: "Analytics", reports: "Reports", notifications: "Notifications",
    settings: "Settings", profile: "Profile", users: "Create User",
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0 bg-background"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground">{PAGE_LABELS[activePage]}</h1>
        {activePage === "chat" && (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-foreground/60 hover:text-foreground hover:bg-secondary transition-all text-xs"
        >
          <Search size={13} />
          <span>Search...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary text-xs">
            <Command size={9} />K
          </kbd>
        </button>

        {activePage === "chat" && (
          <>
            <button
              onClick={onSplitScreen}
              className={`p-2 rounded-lg transition-all text-sm ${splitScreen ? "bg-secondary text-foreground" : "text-foreground/60 hover:text-foreground hover:bg-secondary"}`}
              title="Split Screen"
            >
              <SplitSquareHorizontal size={15} />
            </button>
            <button
              onClick={onRightPanel}
              className={`p-2 rounded-lg transition-all ${rightPanel ? "bg-secondary text-foreground" : "text-foreground/60 hover:text-foreground hover:bg-secondary"}`}
              title="File Preview Panel"
            >
              <PanelRight size={15} />
            </button>
          </>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-secondary transition-all"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={() => onNavigate("notifications")}
          className="relative p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-secondary transition-all"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-foreground" />
        </button>

      </div>
    </header>
  );
};
