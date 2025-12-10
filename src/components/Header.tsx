import { cn } from "@/lib/utils";

interface HeaderProps {
  onLogoClick: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-sm bg-foreground flex items-center justify-center">
              <span className="text-background font-serif text-sm font-semibold">S</span>
            </div>
            <span className="font-serif text-lg font-medium tracking-tight">
              Sunrise<span className="text-primary">.</span>
            </span>
          </button>

          {/* Help Link */}
          <a
            href="#"
            className="text-sm font-sans text-muted-foreground underline-reveal transition-colors hover:text-foreground"
          >
            Help & Support
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
