'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // What to do after login (e.g. redirect)
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  // Close on Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleAuth = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        alert(error.message)
      } else {
        alert('Account created! You are logged in.')
        onSuccess()
        onClose()
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      } else {
        onSuccess() // Trigger the redirect or state update
        onClose()
      }
    }
    setLoading(false)
  }

  if (!isOpen) return null

  // STYLES (Matches your Theme)
  const btnContainer = "group w-full py-2 rounded-full font-bold italic shadow-lg transition bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A] mt-4 disabled:opacity-50"
  const btnText = "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]"

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if(e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white to-[#64C07A]"></div>

        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold italic mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-1">
              {isSignUp ? 'Create Account' : 'Access Hub'}
            </h2>
            <p className="text-gray-400 italic text-sm">
              {isSignUp ? 'Sign up to track your division requests' : 'Login to continue'}
            </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-bold italic text-[#000503]">Email</label>
            <input type="email" required value={email} placeholder="you@dwdg.com" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition"/>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-bold italic text-[#000503]">Password</label>
            <input type="password" required value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition"/>
          </div>

          <button type="submit" disabled={loading} className={btnContainer}>
            <span className={btnText}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 italic cursor-pointer hover:text-[#00B887]" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
            </p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 font-bold">✕</button>
      </div>
    </div>
  )
}