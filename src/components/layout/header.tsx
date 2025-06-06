import { Button } from "@/components/ui/button"
import {
	Settings,
	Wallet
} from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur-sm shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            hisab
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
          <Link
            href="/accounts"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Accounts
          </Link>
          <Link
            href="/transactions"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Transactions
          </Link>
          <Link
            href="/assets"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Assets
          </Link>
          <Link
            href="/liabilities"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Liabilities
          </Link>
          <Link
            href="/reports"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Reports
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
} 