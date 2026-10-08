// Site-wide facts. Copy lives in the pages; the source of truth for facts is docs/bio.md.
export const site = {
  name: "Harith",
  fullName: "Harith Bennet",
  domain: "rith.dev",
  url: "https://rith.dev",
  tagline: "founder and tech nerd",
  description:
    "Harith is a founder and tech nerd in Kuala Lumpur, building DagangNow. Work, a diary, AI reports and photographs.",
  email: "harith.bennett@gmail.com",
  location: "Kuala Lumpur",
  // To update the resume, replace public/resume.pdf. The link stays the same.
  resume: "/resume.pdf",
} as const;

export const nav = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const socials = [
  { href: "https://x.com/rithbennet", label: "X", icon: "x" },
  { href: "https://www.instagram.com/rithbn_/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@rithbennet", label: "TikTok", icon: "tiktok" },
  { href: "https://www.linkedin.com/in/harith-bennet/", label: "LinkedIn", icon: "linkedin" },
  { href: "https://github.com/rithbennet", label: "GitHub", icon: "github" },
] as const;
