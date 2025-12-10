import { cn } from "@/lib/utils";

interface HeaderProps {
  onLogoClick: () => void;
  onLoginClick: () => void;
}

const Header = ({ onLogoClick, onLoginClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Left) */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            {/* REPLACE "/logo.png" WITH THE PATH TO YOUR UPLOADED LOGO FILE */}
            <img 
              src="public\Logo.jpg" 
              alt="Sunrise Software Development " 
              className="h-8 w-auto object-contain" 
            />
          </button>

          {/* Right Side Links (Login & Help) */}
          <div className="flex items-center gap-8">
            <button
              onClick={onLoginClick}
              className="text-sm font-sans text-muted-foreground underline-reveal transition-colors hover:text-primary"
            >
              Login
            </button>

            <a
              href="#"
              className="text-sm font-sans text-muted-foreground underline-reveal transition-colors hover:text-primary"
            >
              Help & Support
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;