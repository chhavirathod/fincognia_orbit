"use client"

import { Card } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface BudgetData {
  category: string
  spent: number
  limit: number
  color: string
}

const budgetData: BudgetData[] = [
  { category: "Food", spent: 400, limit: 500, color: "#00FFC6" },
  { category: "Transportation", spent: 150, limit: 200, color: "#FF3B30" },
  { category: "Entertainment", spent: 200, limit: 300, color: "#34C759" },
  { category: "Utilities", spent: 280, limit: 350, color: "#5AC8FA" },
  { category: "Health", spent: 100, limit: 150, color: "#FFCC00" },
]

const monthlyData = [
  { month: "Jan", spent: 1200, limit: 2000 },
  { month: "Feb", spent: 1450, limit: 2000 },
  { month: "Mar", spent: 1300, limit: 2000 },
  { month: "Apr", spent: 1600, limit: 2000 },
  { month: "May", spent: 1400, limit: 2000 },
  { month: "Jun", spent: 1550, limit: 2000 },
]

const pieChartData = budgetData.map((item) => ({
  name: item.category,
  value: item.spent,
  color: item.color,
}))

export default function BudgetAnalysis() {
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0)
  const totalLimit = budgetData.reduce((sum, item) => sum + item.limit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Budget Analysis</h1>
        <p className="text-muted-foreground mt-1">Track your spending against budget limits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass p-6">
          <p className="text-muted-foreground text-sm mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-accent">${totalSpent}</p>
        </Card>
        <Card className="glass p-6">
          <p className="text-muted-foreground text-sm mb-2">Total Budget</p>
          <p className="text-3xl font-bold text-foreground">${totalLimit}</p>
        </Card>
        <Card className="glass p-6">
          <p className="text-muted-foreground text-sm mb-2">Remaining</p>
          <p className="text-3xl font-bold text-green-400">${(totalLimit - totalSpent).toFixed(2)}</p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="glass p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Spending Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={100}
                fill="#00FFC6"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Budget Progress */}
        <Card className="glass p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Budget by Category</h2>
          <div className="space-y-4">
            {budgetData.map((item) => {
              const percentage = (item.spent / item.limit) * 100
              const isOverBudget = item.spent > item.limit
              return (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? "text-destructive" : "text-accent"}`}>
                      ${item.spent} / ${item.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full smooth-transition ${isOverBudget ? "bg-destructive" : "bg-accent"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="glass p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Spending Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3580" />
            <XAxis dataKey="month" stroke="#A0A8C8" />
            <YAxis stroke="#A0A8C8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2A6C", border: "1px solid #2A3580" }}
              formatter={(value) => `$${value}`}
            />
            <Legend />
            <Bar dataKey="spent" fill="#00FFC6" name="Spent" radius={[8, 8, 0, 0]} />
            <Bar dataKey="limit" fill="#2A3580" name="Limit" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}