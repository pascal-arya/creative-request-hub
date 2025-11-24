'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import RequestModal from '../components/RequestModal' // Import the new modal

export default function TrackPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<any>(null)

  const supabase = createClient()

  // Fetch Function (Reusable for refresh)
  const fetchRequests = async () => {
    const { data } = await supabase
      .from('creative_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setRequests(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Handlers
  const handleAddNew = () => {
    setEditingRequest(null) // Create Mode
    setIsModalOpen(true)
  }

  const handleEdit = (req: any) => {
    setEditingRequest(req) // Edit Mode
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    fetchRequests() // Refresh table
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-300 text-black shadow-[0_0_8px_rgba(147,197,253,0.8)]'
      case 'Accepted': return 'bg-[#00B887] text-black shadow-[0_0_8px_rgba(0,184,135,0.6)]'
      case 'Negotiation': return 'bg-yellow-300 text-black shadow-[0_0_8px_rgba(253,224,71,0.8)]'
      case 'Rejected': return 'bg-red-300 text-black shadow-[0_0_8px_rgba(252,165,165,0.8)]'
      default: return 'bg-gray-200 text-black'
    }
  }

  // SHARED BUTTON STYLE: Gradient 1 Bg / Gradient 2 Text -> FLIP on Hover
  const actionBtnContainer = "group inline-block px-5 py-2 rounded-full font-bold italic transition shadow-md bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A]"
  const actionBtnText = "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503] pb-1"

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#64C07A] p-8 pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 max-w-7xl mx-auto gap-6">
        <h1 className="text-4xl font-bold italic tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-2">
          Track Board
        </h1>
        
        {/* Add Request Button (Opens Modal) */}
        <button onClick={handleAddNew} className={actionBtnContainer}>
           <div className="flex items-center gap-2">
              <span className={actionBtnText}>+ Add new request</span>
           </div>
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl overflow-hidden border border-white/50 bg-white/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gradient-to-r from-[#00B887] to-[#000503] text-white text-xs uppercase italic tracking-wider">
              <tr>
                <th className="px-6 py-5 font-bold">Project Title</th>
                <th className="px-6 py-5 font-bold">Applicant</th>
                <th className="px-6 py-5 font-bold">Type</th>
                <th className="px-6 py-5 font-bold">Due Date</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 text-right font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">Loading requests...</td></tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-[#f0fdf4] transition duration-200">
                  <td className="px-6 py-5">
                    <a href={req.brief_link || '#'} target="_blank" className="font-bold italic text-[#000503] text-lg hover:text-[#00B887] hover:underline decoration-2 underline-offset-2 transition">
                      {req.project_title}
                    </a>
                    <div className="text-xs text-gray-400 italic mt-1 font-medium">Applied: {new Date(req.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="font-bold text-[#000503]">{req.applicant_name}</div>
                    <div className="text-xs text-gray-500 italic">{req.applicant_division}</div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-700">{req.project_type}</td>
                  <td className="px-6 py-5 text-sm font-mono text-gray-600 bg-gray-50/50">{req.requested_deadline}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-black italic uppercase tracking-wider ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>

                  {/* ACTION COLUMN LOGIC */}
                  <td className="px-6 py-5 text-right">
                    
                    {/* CASE 1: Delivered -> Collect Button */}
                    {req.status === 'Accepted' && req.receivable_link ? (
                      <a href={req.receivable_link} target="_blank" className={actionBtnContainer}>
                        <span className={actionBtnText}>Collect Assets</span>
                      </a>
                    ) : 
                    
                    /* CASE 2: New/Negotiation -> Edit Button */
                    (req.status === 'New' || req.status === 'Negotiation') ? (
                       <button onClick={() => handleEdit(req)} className={actionBtnContainer}>
                          <span className={actionBtnText}>Edit Request</span>
                       </button>
                    ) : (
                      
                    /* CASE 3: Rejected or Processing */
                       <span className="text-[10px] text-gray-400 italic font-medium uppercase tracking-widest">Processing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* THE MODAL */}
      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
        initialData={editingRequest}
      />

    </main>
  )
}