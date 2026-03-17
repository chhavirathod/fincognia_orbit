import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useToast } from "./ui/use-toast";

const UserHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Authentication Error",
        description:
          "Please configure Google Auth in your Lovable Cloud settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3"
    >
      {!user ? (
        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="glass-card hover:bg-white/20 text-white font-medium"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </Button>
      ) : (
        <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-full">
          <span className="text-sm text-white font-medium">{user.email}</span>
          <Button
            onClick={handleSignOut}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default UserHeader;
