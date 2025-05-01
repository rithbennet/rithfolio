"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <Button variant='outline' size-='icon' className='rounded-full' onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <FaSun className="absolute h-10 w-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
            </FaSun>
            <FaMoon className="absolute h-10 w-10 rotate-90 scale-0 dark:-rotate-0 dark:scale-100">
            </FaMoon>
        </Button>
    )
}
