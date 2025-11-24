'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // State to track which request is being negotiated
  const [negotiatingId, setNegotiatingId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const router = useRouter()
  const supabase = createClient()

  // 1. Initial Fetch
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('creative_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setRequests(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // 2. The Logic to Update Status
  const updateStatus = async (id: string, newStatus: string, negotiationNotes?: string) => {
    // Optimistic Update: Update UI immediately so it feels fast
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus, negotiation_notes: negotiationNotes } : req
    ))
    setNegotiatingId(null) // Close negotiation box if open

    // Send to Supabase
    // Send to Supabase
    const { error } = await supabase
      .from('creative_requests')
      // @ts-ignore
      .update({ 
        status: newStatus,
        negotiation_notes: negotiationNotes 
      })
      .eq('id', id)

    if (error) alert('Error updating: ' + error.message)
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            {/* Header: Status and Title */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${
                  req.status === 'Accepted' ? 'bg-green-900 text-green-200' : 
                  req.status === 'Rejected' ? 'bg-red-900 text-red-200' : 
                  req.status === 'Negotiation' ? 'bg-yellow-900 text-yellow-200' : 'bg-blue-900 text-blue-200'
                }`}>
                  {req.status}
                </span>
                <span className="text-gray-400 text-sm">{new Date(req.created_at).toLocaleDateString()}</span>
                <h2 className="text-xl font-bold mt-1">{req.project_title}</h2>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-950 p-4 rounded mb-4">
               <p><span className="text-gray-500">Applicant:</span> {req.applicant_name}</p>
               <p><span className="text-gray-500">Type:</span> {req.project_type}</p>
               <p><span className="text-gray-500">Deadline:</span> {req.requested_deadline}</p>
               <p><span className="text-gray-500">Link:</span> <a href={req.brief_link} className="text-blue-400 underline">View Brief</a></p>
               {req.negotiation_notes && (
                 <p className="col-span-2 text-yellow-400 mt-2 border-t border-gray-800 pt-2">
                   Example Note: {req.negotiation_notes}
                 </p>
               )}
            </div>

            {/* Action Buttons */}
            {req.status === 'New' && (
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => updateStatus(req.id, 'Accepted')}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold text-sm"
                >
                  Accept (No Change)
                </button>
                
                <button 
                  onClick={() => setNegotiatingId(req.id)}
                  className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded font-bold text-sm"
                >
                  Negotiate
                </button>
                
                <button 
                  onClick={() => updateStatus(req.id, 'Rejected')}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-bold text-sm"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Negotiation Input Box (Only shows if 'Negotiate' is clicked) */}
            {negotiatingId === req.id && (
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <label className="block text-sm mb-2">What do you want to change?</label>
                <textarea 
                  className="w-full bg-gray-900 p-2 rounded border border-gray-700 mb-2"
                  rows={3}
                  placeholder="e.g. Can we move the deadline to Friday?"
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateStatus(req.id, 'Negotiation', notes)}
                    className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-sm"
                  >
                    Send Negotiation
                  </button>
                  <button 
                    onClick={() => setNegotiatingId(null)}
                    className="text-gray-400 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}