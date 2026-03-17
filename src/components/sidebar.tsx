"use client";

import { Wallet, PieChart, TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeView: "transactions" | "budget" | "goals";
  setActiveView: (view: "transactions" | "budget" | "goals") => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "transactions", label: "Transactions", icon: Wallet },
    { id: "budget", label: "Budget Analysis", icon: PieChart },
    { id: "goals", label: "Financial Goals", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg glass md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-accent" />
        ) : (
          <Menu className="w-6 h-6 text-accent" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`₹{
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-card/50 border-r border-border smooth-transition z-40 flex flex-col`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-accent">FinCognia</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Budget & Expense Analysis
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as "transactions" | "budget" | "goals");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition ₹{
                  isActive
                    ? "bg-accent text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="glass p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Total Balance</p>
            <p className="text-2xl font-bold text-accent">₹12,450.50</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
