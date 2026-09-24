import React from "react";
import { MessageSquare, Bot, CheckSquare, FileText } from "lucide-react";
import { AreaChart, Area, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Page } from "../../types";
import { USAGE_DATA, PIE_DATA, CONVERSATIONS, TASKS } from "../../constants/data";
import { PriorityBadge, StatusChip } from "../shared";

const StatCard = ({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) => (
  <div
    className="p-5 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-200 bg-card"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl bg-secondary">
        <span className="text-foreground">{icon}</span>
      </div>
      <span className="text-xs font-medium text-green-600 dark:text-green-400">{delta}</span>
    </div>
    <div className="text-2xl font-bold text-foreground mb-0.5">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export const DashboardPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
    <div>
      <h2 className="text-xl font-bold text-foreground mb-1">Good morning, Yash 👋</h2>
      <p className="text-sm text-muted-foreground">Here's what's happening with your AI workspace today.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<MessageSquare size={16} />} label="Total Conversations" value="1,284" delta="+12%" />
      <StatCard icon={<Bot size={16} />} label="Active Agents" value="6" delta="2 new" />
      <StatCard icon={<CheckSquare size={16} />} label="Tasks Completed" value="348" delta="+8%" />
      <StatCard icon={<FileText size={16} />} label="Docs Processed" value="92" delta="+24" />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Weekly Usage</h3>
          <select className="text-xs text-muted-foreground bg-transparent border border-border rounded-lg px-2 py-1">
            <option>This Week</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={USAGE_DATA}>
            <defs>
              <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.1} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} labelStyle={{ color: "var(--foreground)" }} />
            <Area type="monotone" dataKey="conversations" stroke="var(--foreground)" strokeWidth={2} fill="url(#convGrad)" name="Conversations" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Usage by Type</h3>
        <ResponsiveContainer width="100%" height={160}>
          <RePieChart>
            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
              {PIE_DATA.map((entry, i) => <Cell key={i} fill={`hsl(0, 0%, ${100 - (i * 20)}%)`} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
          </RePieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-2">
          {PIE_DATA.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: `hsl(0, 0%, ${100 - (i * 20)}%)` }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="text-foreground font-medium">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Activity + Quick Tasks */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Conversations</h3>
        <div className="space-y-3">
          {CONVERSATIONS.slice(0, 4).map(c => (
            <button key={c.id} onClick={() => onNavigate("chat")} className="w-full flex items-center gap-3 hover:bg-secondary rounded-xl p-2 -mx-2 transition-all text-left">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary text-foreground">
                <MessageSquare size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">2h ago</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {TASKS.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${t.status === "completed" ? "bg-green-500" : t.status === "in-progress" ? "bg-foreground" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <PriorityBadge priority={t.priority} />
                  <span className="text-[10px] text-muted-foreground">{t.due}</span>
                </div>
              </div>
              <StatusChip status={t.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
