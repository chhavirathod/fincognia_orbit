"use client";

import { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "expense" | "income";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Grocery Store",
    category: "Food",
    amount: 85.5,
    date: "2024-11-01",
    type: "expense",
  },
  {
    id: "2",
    description: "Salary Deposit",
    category: "Income",
    amount: 3500,
    date: "2024-11-01",
    type: "income",
  },
  {
    id: "3",
    description: "Gas Station",
    category: "Transportation",
    amount: 45.0,
    date: "2024-10-31",
    type: "expense",
  },
  {
    id: "4",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    date: "2024-10-31",
    type: "expense",
  },
  {
    id: "5",
    description: "Restaurant",
    category: "Food",
    amount: 62.3,
    date: "2024-10-30",
    type: "expense",
  },
  {
    id: "6",
    description: "Gym Membership",
    category: "Health",
    amount: 50.0,
    date: "2024-10-30",
    type: "expense",
  },
  {
    id: "7",
    description: "Freelance Project",
    category: "Income",
    amount: 750,
    date: "2024-10-29",
    type: "income",
  },
  {
    id: "8",
    description: "Electric Bill",
    category: "Utilities",
    amount: 120.0,
    date: "2024-10-28",
    type: "expense",
  },
];

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = [
    "all",
    "Food",
    "Transportation",
    "Entertainment",
    "Health",
    "Utilities",
    "Income",
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const csvData = [
      headers.join(","),
      ...filteredTransactions.map(
        (t) =>
          `"₹{t.date}","₹{t.description}","₹{t.category}","₹{t.type}","₹₹{t.amount.toFixed(2)}"`
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions-₹{new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all your income and expenses
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium smooth-transition ₹{
                  filterCategory === cat ? "bg-accent text-accent-foreground" : "glass text-foreground hover:bg-muted"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-muted/30 smooth-transition"
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-accent">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`font-medium ₹{transaction.type === "income" ? "text-green-400" : "text-foreground"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold text-right ₹{
                      transaction.type === "income" ? "text-green-400" : "text-foreground"
                    }`}
                  >
                    ₹{transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded smooth-transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTransactions.length === 0 && (
        <Card className="glass p-8 text-center">
          <p className="text-muted-foreground">No transactions found</p>
        </Card>
      )}
    </div>
  );
}
