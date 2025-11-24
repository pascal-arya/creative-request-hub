'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  // Button Style Constants (Flip Logic: Dark -> Light)
  const btnContainer = "group w-full py-3 rounded-full font-bold italic shadow-lg transition bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A] mt-4 disabled:opacity-50"
  const btnText = "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]"

  return (
    // REQ 1: Background Gradient 1
    <main className="min-h-screen bg-gradient-to-b from-[#00B887] to-[#000503] flex items-center justify-center p-4">
      
      {/* WHITE CARD CONTAINER */}
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white to-[#64C07A]"></div>

        <div className="text-center mb-8">
            {/* REQ 3: Title Gradient 1 */}
            <h1 className="text-3xl font-bold italic mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-1">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 italic text-sm">
              Login to get access to control panel
            </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* REQ 4: DWDG Black */}
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Email</label>
            <input 
              type="email" 
              value={email}
              placeholder="admin@dwdg.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Password</label>
            <input 
              type="password" 
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400"
            />
          </div>

          {/* REQ 2: Button Logic (Gradient 1 Bg / Gradient 2 Text -> Flip on Hover) */}
          <button 
            type="submit" 
            disabled={loading}
            className={btnContainer}
          >
            <span className={btnText}>
              {loading ? 'Verifying...' : 'Login'}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 italic">
                Restricted for internal DWDG staff only.
            </p>
        </div>

      </div>
    </main>
  )
}