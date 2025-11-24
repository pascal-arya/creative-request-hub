'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: any
}

export default function RequestModal({ isOpen, onClose, onSuccess, initialData }: RequestModalProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState<any[]>([])
  const [agreed, setAgreed] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_division: '',
    client_email: '',
    project_title: '',
    project_type: '',
    brief_link: '',
    requested_deadline: ''
  })

  // 1. ESC Key Listener (New Feature)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    // Cleanup: Remove listener when modal closes to prevent memory leaks
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 2. Reset or Fill Form
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
            applicant_name: initialData.applicant_name,
            applicant_division: initialData.applicant_division,
            client_email: initialData.client_email,
            project_title: initialData.project_title,
            project_type: initialData.project_type,
            brief_link: initialData.brief_link,
            requested_deadline: initialData.requested_deadline
        })
        setAgreed(true)
      } else {
        setFormData({
            applicant_name: '',
            applicant_division: '',
            client_email: '',
            project_title: '',
            project_type: '',
            brief_link: '',
            requested_deadline: ''
        })
        setAgreed(false)
      }
    }
  }, [isOpen, initialData])

  // 3. Fetch Types
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

    let error;

    if (initialData) {
      const { error: updateError } = await supabase
        .from('creative_requests')
        // @ts-ignore
        .update({
            applicant_name: formData.applicant_name,
            applicant_division: formData.applicant_division,
            client_email: formData.client_email,
            project_title: formData.project_title,
            project_type: formData.project_type,
            brief_link: formData.brief_link,
            requested_deadline: formData.requested_deadline
        })
        .eq('id', initialData.id)
        error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('creative_requests')
        // @ts-ignore
        .insert([{
            ...formData,
            status: 'New'
        }])
        error = insertError
    }

    setLoading(false)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      onSuccess()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    // Overlay (Clicking here also closes modal for better UX)
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if(e.target === e.currentTarget) onClose() }}
    >
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        
        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white to-[#64C07A]"></div>

        <h2 className="text-3xl font-bold italic mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-1">
          {initialData ? 'Edit Request' : 'New Creative Request'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
           {/* Row 1 */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-bold italic text-[#000503]">Your Name</label>
              <input required name="applicant_name" value={formData.applicant_name} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-bold italic text-[#000503]">Department</label>
              <input required name="applicant_division" value={formData.applicant_division} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-bold italic text-[#000503]">Email</label>
            <input required type="email" name="client_email" value={formData.client_email} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-bold italic text-[#000503]">Project Title</label>
            <input required name="project_title" value={formData.project_title} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1 text-sm font-bold italic text-[#000503]">Project Type</label>
            <select required name="project_type" value={formData.project_type} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]">
                <option value="">Select a type...</option>
                {types.map(t => <option key={t.type_name} value={t.type_name}>{t.type_name}</option>)}
            </select>
          </div>

          {/* Date & Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 text-sm font-bold italic text-[#000503]">Deadline</label>
                <input required type="date" name="requested_deadline" value={formData.requested_deadline} onChange={handleChange} className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
            </div>
            <div>
                <label className="block mb-1 text-sm font-bold italic text-[#000503]">Link Assets</label>
                <input name="brief_link" value={formData.brief_link || ''} onChange={handleChange} placeholder="https://" className="w-full bg-[#F4F4F4] p-3 rounded-xl text-[#000503] text-sm outline-none focus:ring-2 focus:ring-[#00B887]" />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" id="modal_agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-[#00B887]" />
            <label htmlFor="modal_agree" className="text-xs text-gray-500 italic">I agree to DWDG Regulations.</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
             <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-300 text-[#000503] font-bold italic py-2 rounded-full hover:bg-gray-100">
                Cancel
              </button>
              
              {/* UPDATED LOGIC: 
                  - Unchecked: Bg Gradient 2 / Text Gradient 1
                  - Checked: Bg Gradient 1 / Text Gradient 2
              */}
              <button 
                type="submit" 
                disabled={loading || !agreed}
                className={`flex-[2] font-bold italic py-2 rounded-full shadow-lg transition group
                  ${!agreed 
                    ? "bg-gradient-to-b from-white to-[#64C07A] opacity-70" // Unchecked: Grad 2 Bg
                    : "bg-gradient-to-b from-[#00B887] to-[#000503] hover:opacity-95" // Checked: Grad 1 Bg
                  }
                `}
              >
                 <span className={`bg-clip-text text-transparent 
                   ${!agreed 
                     ? "bg-gradient-to-b from-[#00B887] to-[#000503]" // Unchecked: Grad 1 Text
                     : "bg-gradient-to-b from-white to-[#64C07A]" // Checked: Grad 2 Text
                   }
                 `}>
                  {loading ? 'Saving...' : (initialData ? 'Update Request' : 'Submit Request')}
                </span>
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}