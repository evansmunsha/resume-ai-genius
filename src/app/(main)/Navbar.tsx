"use client";

import logo from "@/assets/logo.jpeg";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CreditCard, FileText, FileTextIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const isResumePage = pathname.includes("/resumes") || pathname.includes("/editor");
  const isCoverLetterPage = pathname.includes("/cover-letters") || pathname.includes("/cover-letter-editor");

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            <span className="text-xl font-bold tracking-tight">
              Resume AI Genius
            </span>
          </Link>
          
          <nav className="hidden space-x-4 sm:flex">
            <Link 
              href="/resumes" 
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isResumePage ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            >
              <FileText className="size-4" />
              Resumes
            </Link>
            <Link 
              href="/cover-letters"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${isCoverLetterPage ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            >
              <FileTextIcon className="size-4" />
              Cover Letters
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
