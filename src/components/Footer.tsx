import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex gap-6">
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          <p className="text-muted-foreground text-center">
            © 2025 FinCognia. Built for the future of digital finance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
