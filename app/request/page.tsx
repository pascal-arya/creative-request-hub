'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RequestForm() {
  const supabase = createClient()
  const router = useRouter()
  
  // 1. Loading States (Good UX)
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState<any[]>([])

  // 2. Form State (The "Controlled Component" part)
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_division: '',
    client_email: '',
    project_title: '',
    project_type: '',
    brief_link: '',
    requested_deadline: ''
  })

  // 3. Fetch Project Types on Load (for the dropdown)
  useEffect(() => {
    const fetchTypes = async () => {
      const { data } = await supabase.from('type_description').select('*')
      if (data) setTypes(data)
    }
    fetchTypes()
  }, [])

  // 4. Handle Text Changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 5. Handle Submission (The Bridge to Database)
  const handleSubmit = async (e: any) => {
    e.preventDefault() // Stop page from refreshing
    setLoading(true)

    // Send data to Supabase
    const { error } = await supabase
      .from('creative_requests')
      .insert([
        {
          applicant_name: formData.applicant_name,
          applicant_division: formData.applicant_division,
          client_email: formData.client_email,
          project_title: formData.project_title,
          project_type: formData.project_type,
          brief_link: formData.brief_link,
          requested_deadline: formData.requested_deadline,
          status: 'New' // Explicitly set status
        }
      ] as any)

    if (error) {
      alert('Error submitting request: ' + error.message)
      setLoading(false)
    } else {
      alert('Success! Your request has been sent.')
      router.push('/') // Redirect home
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">New Creative Request</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
          
          {/* Row 1: Name & Division */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Your Name</label>
              <input required name="applicant_name" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
            </div>
            <div>
              <label className="block mb-1 text-sm">Division</label>
              <input required name="applicant_division" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Email (for notifications)</label>
            <input required type="email" name="client_email" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
          </div>

          {/* Project Title */}
          <div>
            <label className="block mb-1 text-sm">Project Title</label>
            <input required name="project_title" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
          </div>

          {/* Type Dropdown (Populated from DB) */}
          <div>
            <label className="block mb-1 text-sm">Project Type</label>
            <select required name="project_type" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700">
              <option value="">Select a type...</option>
              {types.map(t => (
                <option key={t.type_name} value={t.type_name}>{t.type_name}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block mb-1 text-sm">Requested Deadline</label>
            <input required type="date" name="requested_deadline" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
          </div>

          {/* Link */}
          <div>
            <label className="block mb-1 text-sm">Link to Brief/Assets</label>
            <input name="brief_link" placeholder="https://..." onChange={handleChange} className="w-full p-2 rounded bg-gray-800 border border-gray-700" />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded mt-4 disabled:opacity-50 transition"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

        </form>
      </div>
    </main>
  )
}