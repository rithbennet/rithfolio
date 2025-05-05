import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function SocialLinks() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="https://www.linkedin.com/in/harith-bennet/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <FaLinkedin className="h-5 w-5" />
        <span className="sr-only">LinkedIn</span>
      </Link>
      <Link
        href="https://github.com/rithbennet"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <FaGithub className="h-5 w-5" />
        <span className="sr-only">GitHub</span>
      </Link>
      <Link
        href="mailto:harith.bennett@gmail.com"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <MdEmail className="h-5 w-5" />
        <span className="sr-only">Email</span>
      </Link>
    </div>
  );
}
