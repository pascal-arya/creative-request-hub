'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Helper Component for the Links
  const NavLink = ({ href, label, mobile = false }: { href: string, label: string, mobile?: boolean }) => {
    const active = pathname === href

    // 1. Container Styles
    const containerClasses = active 
      ? "bg-gradient-to-b from-[#00B887] to-[#000503]" // Gradient 1 Background
      : "hover:bg-gray-100"

    // 2. Text Styles
    const textClasses = active
      ? "bg-clip-text text-transparent bg-gradient-to-r from-white to-[#64C07A]" // Gradient 2 Text
      : "text-[#000503]"

    return (
      <Link 
        href={href} 
        onClick={() => setIsOpen(false)} // Close menu on click
        className={`
          ${mobile ? 'block w-full text-center' : ''}
          px-4 py-2 rounded-full font-bold text-sm italic transition-all ${containerClasses}
        `}
      >
        <span className={textClasses}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav className="w-full bg-white text-[#000503] sticky top-0 z-50 shadow-md">
      <div className="py-4 px-8 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold italic tracking-tighter">dwdg.</h1>
          <div className="w-[1px] h-6 bg-[#000503] mx-2"></div>
          <span className="text-xs leading-tight">
            Creative<br/>Hub
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/request" label="Apply" />
          <NavLink href="/track" label="Track" />
          <NavLink href="/regulation" label="Regulation" />
          <NavLink href="/admin" label="Admin" />
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-[#000503] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
             // Close Icon
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          ) : (
             // Menu Icon
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
             </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <NavLink href="/" label="Home" mobile />
          <NavLink href="/request" label="Apply" mobile />
          <NavLink href="/track" label="Track" mobile />
          <NavLink href="/regulation" label="Regulation" mobile />
          <NavLink href="/admin" label="Admin" mobile />
        </div>
      )}
    </nav>
  )
}