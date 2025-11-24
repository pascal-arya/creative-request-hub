'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  // Helper Component for the Links
  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const active = pathname === href

    // 1. Container Styles (The Button Shape & Background)
    const containerClasses = active 
      ? "bg-gradient-to-b from-[#00B887] to-[#000503]" // Gradient 1 Background
      : "hover:bg-gray-100"

    // 2. Text Styles (The Font Color & Gradient)
    const textClasses = active
      ? "bg-clip-text text-transparent bg-gradient-to-r from-white to-[#64C07A]" // Gradient 2 Text
      : "text-[#000503]"

    return (
      <Link href={href} className={`px-4 py-2 rounded-full font-bold text-sm italic transition-all ${containerClasses}`}>
        <span className={textClasses}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav className="w-full bg-white text-[#000503] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
      {/* Logo Area */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold italic tracking-tighter">dwdg.</h1>
        <div className="w-[1px] h-6 bg-[#000503] mx-2"></div>
        <span className="text-xs leading-tight">
          Creative<br/>Hub
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-2">
        <NavLink href="/" label="Home" />
        <NavLink href="/request" label="Apply" />
        <NavLink href="/track" label="Track" />
        <NavLink href="/regulation" label="Regulation" />
        <NavLink href="/admin" label="Admin" />
      </div>
    </nav>
  )
}