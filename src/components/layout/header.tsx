import { Button } from "@/components/ui/button"
import {
  Settings,
  Wallet
} from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur-sm shadow-sm flex justify-center">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Hisab
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/accounts"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Accounts
          </Link>
          <Link
            href="/dashboard/transactions"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Transactions
          </Link>
          <Link
            href="/dashboard/reports"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Reports
          </Link>
        </nav>
      </div>
    </header>
  )
} 