'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: admin } = await supabase.from('admins').select('*').eq('id', user.id).single()
        setIsAdmin(!!admin)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/' 
  }

  const handleLoginSuccess = () => {
    window.location.reload() 
  }

  // INTELLIGENT LINK COMPONENT (Handles Active State & Gradient Hover)
  const ProtectedLink = ({ href, label }: { href: string, label: string }) => {
    const active = pathname === href
    
    // Gradient 1 (Dark)
    const activeContainer = "bg-gradient-to-b from-[#00B887] to-[#000503] shadow-md"
    // Gradient 2 (Light) Text
    const activeText = "bg-clip-text text-transparent bg-gradient-to-r from-white to-[#64C07A]"

    const inactiveContainer = "hover:bg-gradient-to-b hover:from-[#00B887] hover:to-[#000503]"
    const inactiveText = "text-[#000503] group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#64C07A]"


    const handleClick = (e: any) => {
        const protectedRoutes = ['/request', '/track', '/admin']
        if (protectedRoutes.includes(href) && !user) {
            e.preventDefault()
            setTargetPath(href)
            setIsLoginOpen(true) 
        }
    }

    return (
      <Link 
        href={href} 
        onClick={handleClick} 
        className={`px-4 py-2 rounded-full font-bold text-sm italic transition-all group ${active ? activeContainer : inactiveContainer}`}
      >
        <span className={active ? activeText : inactiveText}>
          {label}
        </span>
      </Link>
    )
  }

  // Standard Link Helper (For public routes like Home, Regulation, Login)
  const NavLink = ({ href, label }: { href: string, label: string }) => {
    const active = pathname === href
    const activeContainer = "bg-gradient-to-b from-[#00B887] to-[#000503] shadow-md"
    const activeText = "bg-clip-text text-transparent bg-gradient-to-r from-white to-[#64C07A]"
    const inactiveContainer = "hover:bg-gradient-to-b hover:from-[#00B887] hover:to-[#000503]"
    const inactiveText = "text-[#000503] group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#64C07A]"

    return (
      <Link 
        href={href} 
        className={`px-4 py-2 rounded-full font-bold text-sm italic transition-all group ${active ? activeContainer : inactiveContainer}`}
      >
        <span className={active ? activeText : inactiveText}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <>
        <nav className="w-full bg-white text-[#000503] py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold italic tracking-tighter">dwdg.</h1>
            <div className="w-[1px] h-6 bg-[#000503] mx-2"></div>
            <span className="text-xs leading-tight">Creative<br/>Hub</span>
        </div>

        <div className="flex gap-2">
            {/* Using NavLink for all primary items for consistent styling */}
            <NavLink href="/" label="Home" />
            <ProtectedLink href="/request" label="Apply" />
            <ProtectedLink href="/track" label="Track" />
            <NavLink href="/regulation" label="Regulation" />
            
            {loading ? (
                <span className="px-4 py-2 text-gray-400 text-sm italic">...</span>
            ) : !user ? (
                <NavLink href="/login" label="Login" />
            ) : isAdmin ? (
                <ProtectedLink href="/admin" label="Admin" />
            ) : (
                <button onClick={handleLogout} className="px-4 py-2 rounded-full font-bold text-sm italic transition-all text-[#000503] hover:bg-gray-100">
                    Logout
                </button>
            )}
        </div>
        </nav>

        {/* POPUP (Only triggered by ProtectedLinks like Track/Apply) */}
        {/* We need to redeploy the LoginModal.tsx as well if we removed it earlier */}
        {/* <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)}
            onSuccess={handleLoginSuccess}
        /> */}
    </>
  )
}