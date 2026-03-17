import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import AvatarViewer from "@/components/AvatarViewer";

type NavSection = "dashboard" | "wallet" | "credit-score" | "nri-gateway";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");

  const navItems = [
    { id: "dashboard" as NavSection, label: "Dashboard" },
    { id: "wallet" as NavSection, label: "Wallet" },
    { id: "credit-score" as NavSection, label: "Credit Score" },
    { id: "nri-gateway" as NavSection, label: "NRI Gateway" },
  ];

  const transactions = [
    {
      id: 1,
      type: "received",
      amount: 2500,
      description: "Salary Payment",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "sent",
      amount: 150,
      description: "Grocery Shopping",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "received",
      amount: 500,
      description: "Freelance Work",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F2D] via-[#1A1F4D] to-[#1F2A6C] text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0F2D]/60 border-b border-[#00FFC6]/30 shadow-[0_0_20px_rgba(0,255,198,0.15)]"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-white to-[#00FFC6] bg-clip-text text-transparent">
                FinCognia
              </span>
            </motion.div>

            <div className="flex gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "credit-score") {
                      navigate("/credit");
                    } else if (item.id === "nri-gateway") {
                      navigate("/nri");
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? "text-[#00FFC6]"
                      : "text-white/70 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FFC6] shadow-[0_0_8px_rgba(0,255,198,0.6)]"
                    />
                  )}
                </motion.button>
              ))}
              {/* ✅ NEW Transactions nav button */}
              <motion.button
                onClick={() => navigate("/transactions")}
                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-[#00FFC6] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Transactions
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="glass-card text-[#00FFC6]/20 hover:text-[#00FFC6]/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Wallet className="w-5 h-5 text-[#00FFC6]" />
                      Wallet Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="text-4xl font-bold bg-gradient-to-r from-white to-[#00FFC6] bg-clip-text text-transparent"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      ₹45,230.00
                    </motion.div>
                    <p className="text-white/60 mt-2">Available Balance</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ✅ Card that navigates to /transactions */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card
                  className="glass-card text-[#00FFC6]/20 hover:text-[#00FFC6]/40 cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => navigate("/transactions")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <CreditCard className="w-5 h-5 text-[#00FFC6]" />
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "received"
                                  ? "bg-[#00FFC6]/20"
                                  : "bg-red-500/20"
                              }`}
                            >
                              {transaction.type === "received" ? (
                                <ArrowDownLeft className="w-4 h-4 text-[#00FFC6]" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-white/60">
                                {transaction.time}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              transaction.type === "received"
                                ? "text-[#00FFC6]"
                                : "text-red-400"
                            }`}
                          >
                            {transaction.type === "received" ? "+" : "-"}₹
                            {transaction.amount}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Credit Score Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="glass-card text-[#00FFC6]/20 hover:text-[#00FFC6]/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-[#00FFC6]" />
                      Credit Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-[#00FFC6]">
                          750
                        </div>
                        <p className="text-white/60 mt-1">Excellent</p>
                      </div>
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="rgba(0, 255, 198, 0.2)"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#00FFC6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(750 / 900) * 251.2} 251.2`}
                          />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Fraud Detection Button */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Link to="/fraud-detection">
                  <Button className="w-full bg-gradient-to-r from-[#00FFC6]/80 to-[#00FFC6] text-[#0A0F2D] font-semibold py-6 text-lg hover:from-[#00FFC6] hover:to-[#00FFC6]/90">
                    Go to Fraud Detection Learning Module
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Avatar */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative cursor-pointer flex flex-col items-center gap-4">
                <div
                  onClick={() => navigate("/app")}
                  className="glass-card p-8 rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,198,0.4)] transition-all"
                  title="Talk to FinCognia AI"
                >
                  <Avatar className="w-48 h-48 border-4 border-[#00FFC6]/30">
                    <div className="w-64 h-64">
                      <AvatarViewer isSpeaking={false} />
                    </div>
                  </Avatar>
                  <p className="mt-4 text-center text-lg font-semibold text-white">
                    AI Assistant
                  </p>
                  <p className="text-sm text-white/60 text-center">
                    Click to Chat with Me
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/twilio")}
                  className="bg-gradient-to-r from-[#00FFC6]/80 to-[#00FFC6] text-[#0A0F2D] font-semibold px-6 py-3 rounded-xl text-base hover:from-[#00FFC6] hover:to-[#00FFC6]/90"
                >
                  ⚡ Automatic Payments
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Wallet Section */}
        {activeSection === "wallet" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass-card text-[#00FFC6]/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Wallet Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Balance</span>
                    <span className="text-2xl font-bold text-[#00FFC6]">
                      ₹45,230.00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
