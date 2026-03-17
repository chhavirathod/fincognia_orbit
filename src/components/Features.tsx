import { motion } from "framer-motion";
import { Mic, Wallet, Brain, User } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-First Banking",
    description:
      "Talk to FinCognia. Make payments, check balances, and ask for advice using natural voice.",
  },
  {
    icon: Wallet,
    title: "Frictionless UPI Wallet",
    description:
      "Instant transfers and invisible UPI automation built directly into your account.",
  },
  {
    icon: Brain,
    title: "AI Financial Insights",
    description:
      "Gemini-powered intelligence analyzing your spending, saving, and investing patterns.",
  },
  {
    icon: User,
    title: "3D Avatar Experience",
    description:
      "A lifelike Ready Player Me avatar that speaks, listens, and reacts in real time.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Banking, <span className="text-gradient">Reimagined</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of financial services with cutting-edge AI
            technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-8 group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300"
            >
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
