import { motion } from "framer-motion";

const technologies = [
  { name: "React", color: "#61DAFB" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Razorpay", color: "#0078FF" },
  { name: "Gemini AI", color: "#00FFC6" },
  { name: "n8n", color: "#EA4B71" },
  { name: "Ready Player Me", color: "#FF6B6B" },
];

const TechStack = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-8 text-lg">
            Powered by industry-leading technology
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="glass-card px-6 py-3 rounded-full"
              >
                <span
                  className="font-semibold text-sm"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
