import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-univalle-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/images/logo-univalle.png" alt="Universidad del Valle" className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-bold text-univalle-red-600">Universidad del Valle</h1>
              <p className="text-sm text-univalle-gray-600">Sede Palmira</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-4">
            <Link href="/access-control">
              <Button variant="ghost" className="text-univalle-gray-700 hover:text-univalle-red-600">
                Control de Acceso
              </Button>
            </Link>
            <Link href="/induction-control">
              <Button variant="ghost" className="text-univalle-gray-700 hover:text-univalle-red-600">
                Inducciones
              </Button>
            </Link>
            <Link href="/equipment-loan">
              <Button variant="ghost" className="text-univalle-gray-700 hover:text-univalle-red-600">
                Préstamos
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button
                variant="outline"
                className="border-univalle-red-600 text-univalle-red-600 hover:bg-univalle-red-50"
              >
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
