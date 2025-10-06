import Link from "next/link";
import ThemeToggle from "../app/theme-toggle";

const Header = () => {
  return (
    <header className="bg-background/20 fixed top-0 right-0 left-0 z-50 w-full px-4 py-3 backdrop-blur-lg transition-colors duration-300">
      <div className="container mx-auto flex max-w-3xl items-center justify-between px-4">
        <nav className="flex space-x-2 text-xs sm:space-x-3 sm:text-sm md:space-x-6 md:text-base">
          <Link href="/" className="hover:text-primary transition-colors">
            home
          </Link>
          <Link
            href="/projects"
            className="hover:text-primary transition-colors"
          >
            projects
          </Link>
          <Link href="/skills" className="hover:text-primary transition-colors">
            skills
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            contact
          </Link>
          <Link href="/blogs" className="hover:text-primary transition-colors">
            blogs
          </Link>
        </nav>

        {/* Empty div for desktop layout balance - only on desktop */}
        <div className="hidden md:block"></div>

        {/* Theme Toggle and other items */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
