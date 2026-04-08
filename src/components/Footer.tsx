import { Github, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-popover py-4 px-6 text-center">
    <p className="text-sm text-muted-foreground">
      © MYHUB DEVELOP SPACE &nbsp;Powered by:&nbsp;
      <a
        href="https://ilgazmod.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        ILGAZMOD
      </a>
      &nbsp;bir SWO ekibidir&nbsp;
      <a
        href="https://github.com/Scaty-Web/myhub-creator-space"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
      </a>
      &nbsp;
      <Link
        to="/help"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-xs">Yardım</span>
      </Link>
    </p>
  </footer>
);

export default Footer;
