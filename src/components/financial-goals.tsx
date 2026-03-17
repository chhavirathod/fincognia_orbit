"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Plus, Trash2, X } from "lucide-react"

interface FinancialGoal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  strategy: string
}

const defaultGoals: FinancialGoal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    description: "Build 6 months of living expenses",
    targetAmount: 15000,
    currentAmount: 8500,
    deadline: "2025-06-01",
    strategy: "Save $500/month from salary. Use high-yield savings account (4.5% APY).",
  },
  {
    id: "2",
    title: "Vacation Fund",
    description: "Save for a dream vacation",
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: "2024-12-15",
    strategy: "Redirect food savings and side gig income ($300/month).",
  },
  {
    id: "3",
    title: "Pay Off Credit Card",
    description: "Eliminate high-interest debt",
    targetAmount: 3500,
    currentAmount: 1200,
    deadline: "2025-03-01",
    strategy: "Use balance transfer card (0% APR for 12 months). Pay $600/month to avoid interest.",
  },
  {
    id: "4",
    title: "Invest in Portfolio",
    description: "Build investment portfolio",
    targetAmount: 50000,
    currentAmount: 12000,
    deadline: "2027-12-31",
    strategy: "Invest $1000/month in index funds (SPY, VTI). Long-term wealth building.",
  },
]

export default function FinancialGoals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    strategy: "",
  })

  useEffect(() => {
    const savedGoals = localStorage.getItem("financialGoals")
    setGoals(savedGoals ? JSON.parse(savedGoals) : defaultGoals)
  }, [])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("financialGoals", JSON.stringify(goals))
    }
  }, [goals])

  const handleAddGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert("Please fill in all required fields")
      return
    }

    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      strategy: formData.strategy,
    }

    setGoals([...goals, newGoal])
    setFormData({
      title: "",
      description: "",
      targetAmount: "",
      deadline: "",
      strategy: "",
    })
    setShowAddGoal(false)
  }

  const handleAddFunds = (goalId: string) => {
    const amount = Number.parseFloat(fundAmount[goalId] || "0")
    if (amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
          }
        }
        return goal
      }),
    )

    setFundAmount({ ...fundAmount, [goalId]: "" })
    setShowAddFunds(null)
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Financial Goals</h1>
          <p className="text-muted-foreground mt-1">
            Track progress and strategies to achieve your financial goals using credit wisely
          </p>
        </div>
        <Button
          onClick={() => setShowAddGoal(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 flex gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {showAddGoal && (
        <Card className="glass p-6 border-accent/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">Create New Goal</h2>
            <button onClick={() => setShowAddGoal(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Goal Title *</label>
              <input
                type="text"
                placeholder="e.g., Emergency Fund"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Target Amount ($) *</label>
              <input
                type="number"
                placeholder="15000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Description</label>
              <input
                type="text"
                placeholder="Save for a vacation"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Deadline *</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground block mb-2">Strategy</label>
              <textarea
                placeholder="How will you achieve this goal?"
                value={formData.strategy}
                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleAddGoal} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
              Create Goal
            </Button>
            <Button
              onClick={() => setShowAddGoal(false)}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <Card key={goal.id} className="glass p-6 hover:border-accent/50 smooth-transition relative">
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-accent transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Goal Header */}
              <div className="flex items-start gap-4 mb-4 pr-6">
                <div className="p-3 bg-accent/20 rounded-lg flex-shrink-0">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground break-words">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold text-accent">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent smooth-transition" style={{ width: `${percentage}%` }} />
                </div>
              </div>

              {/* Amount Info */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Current</p>
                  <p className="text-lg font-bold text-foreground">${goal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs mb-1">of</p>
                  <p className="text-lg font-bold text-accent">${goal.targetAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-1">Deadline</p>
                  <p className="text-lg font-bold text-foreground">{daysLeft > 0 ? `${daysLeft}d` : "Done"}</p>
                </div>
              </div>

              {/* Strategy */}
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-semibold text-accent mb-1">Strategy</p>
                <p className="text-xs text-foreground">{goal.strategy}</p>
              </div>

              {showAddFunds === goal.id && (
                <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={fundAmount[goal.id] || ""}
                      onChange={(e) => setFundAmount({ ...fundAmount, [goal.id]: e.target.value })}
                      className="flex-1 px-2 py-1 bg-muted border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                    <Button
                      onClick={() => handleAddFunds(goal.id)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs px-3"
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => setShowAddFunds(null)}
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted text-xs px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddFunds(goal.id)}
                  className="flex-1 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Add Funds
                </Button>
                {percentage === 100 && (
                  <Button
                    variant="outline"
                    className="flex-1 text-xs border-accent text-accent hover:bg-accent/10 bg-transparent"
                  >
                    Completed
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <Card className="glass p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first financial goal to get started</p>
          <Button onClick={() => setShowAddGoal(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Create First Goal
          </Button>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="glass p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">💡 Tips to Achieve Goals Faster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-foreground">Use 0% APR Credit Cards</p>
              <p className="text-muted-foreground text-xs">
                Balance transfer credit cards for 12-21 months interest-free to pay off debt faster.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-foreground">Automate Savings</p>
              <p className="text-muted-foreground text-xs">
                Set up automatic transfers on payday to remove temptation to spend.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-foreground">Strategic Rewards</p>
              <p className="text-muted-foreground text-xs">
                Use cashback and reward cards for regular spending, then apply to goals.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              4
            </div>
            <div>
              <p className="font-semibold text-foreground">Emergency Fund First</p>
              <p className="text-muted-foreground text-xs">
                Build 3-6 months of expenses before aggressive debt payoff to avoid new debt.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}