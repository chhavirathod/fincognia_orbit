"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar.tsx"
import TransactionHistory from "@/components/transaction-history.tsx"
import BudgetAnalysis from "@/components/budget-analysis.tsx"
import FinancialGoals from "@/components/financial-goals.tsx"


type ViewType = "transactions" | "budget" | "goals"

export default function Transaction() {
  const [activeView, setActiveView] = useState<ViewType>("transactions")

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0A0F2D] via-[#1A1F4D] to-[#0A0F2D]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} />} */}
{activeView === "transactions" && <TransactionHistory />}
{activeView === "budget" && <BudgetAnalysis />}
{activeView === "goals" && <FinancialGoals />}

        </div>
      </main>
    </div>
  )
}