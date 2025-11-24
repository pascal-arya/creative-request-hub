'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RequestForm() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState<any[]>([])
  
  const [agreed, setAgreed] = useState(false)

  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_division: '',
    client_email: '',
    project_title: '',
    project_type: '',
    brief_link: '',
    requested_deadline: ''
  })

  useEffect(() => {
    const fetchTypes = async () => {
      const { data } = await supabase.from('type_description').select('*')
      if (data) setTypes(data)
    }
    fetchTypes()
  }, [])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!agreed) return 
    
    setLoading(true)

    const { error } = await supabase
      .from('creative_requests')
      // @ts-ignore
      .insert([{
        applicant_name: formData.applicant_name,
        applicant_division: formData.applicant_division,
        client_email: formData.client_email,
        project_title: formData.project_title,
        project_type: formData.project_type,
        brief_link: formData.brief_link,
        requested_deadline: formData.requested_deadline,
        status: 'New'
      }])

    if (error) {
      alert('Error submitting request: ' + error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#00B887] to-[#000503] flex items-center justify-center p-4 md:p-8">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white to-[#64C07A]"></div>

        <h1 className="text-3xl font-bold italic mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
          New Creative Request
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm font-bold italic text-[#000503]">Your Name</label>
              <input required name="applicant_name" placeholder="Ex: Pascal" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold italic text-[#000503]">Department</label>
              <input required name="applicant_division" placeholder="Ex: Marketing" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400" />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Email (for notification)</label>
            <input required type="email" name="client_email" placeholder="you@dwdg.com" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Project Title</label>
            <input required name="project_title" placeholder="Ex: Year End Banner 2025" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Project Type</label>
            <div className="relative">
              <select required name="project_type" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition appearance-none cursor-pointer">
                <option value="">Select a type...</option>
                {types.map(t => (
                  <option key={t.type_name} value={t.type_name}>{t.type_name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Requested Deadline</label>
            <input required type="date" name="requested_deadline" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition uppercase text-gray-600" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold italic text-[#000503]">Link to Brief/Assets</label>
            <input name="brief_link" placeholder="https://" onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887] transition placeholder-gray-400" />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="agree_terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 accent-[#00B887] cursor-pointer"
            />
            <label htmlFor="agree_terms" className="text-xs text-gray-500 italic cursor-pointer select-none">
              I agree to the <Link href="/regulation" target="_blank" className="text-[#00B887] underline hover:text-[#000503]">DWDG Regulations</Link> regarding creative requests.
            </label>
          </div>

          <div className="flex gap-4 pt-2">
             <button 
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-white border border-gray-300 text-[#000503] font-bold italic py-3 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              
              {/* UPDATED BUTTON LOGIC */}
              <button 
                type="submit" 
                disabled={loading || !agreed}
                className={`flex-[2] font-bold italic py-3 rounded-full shadow-lg transition group disabled:cursor-not-allowed
                  ${!agreed 
                    ? "bg-gradient-to-b from-white to-[#64C07A] opacity-70" // Unchecked
                    : "bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A]" // Checked (Dark -> Light Hover)
                  }
                `}
              >
                <span className={`bg-clip-text text-transparent 
                  ${!agreed
                    ? "bg-gradient-to-b from-[#00B887] to-[#000503]" // Unchecked Text
                    : "bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]" // Checked Text (Light -> Dark Hover)
                  }
                `}>
                  {loading ? 'Sending...' : 'Submit Request'}
                </span>
              </button>
          </div>

        </form>
      </div>
    </main>
  )
}