'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState('review')

  const [negotiatingId, setNegotiatingId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  
  // Delivery State
  const [deliverId, setDeliverId] = useState<string | null>(null)
  const [deliverLink, setDeliverLink] = useState('')

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: reqData } = await supabase
        .from('creative_requests')
        .select(`*, staff (staff_name)`)
        .order('created_at', { ascending: false })

      const { data: staffData } = await supabase.from('staff').select('*')

      if (reqData) setRequests(reqData)
      if (staffData) setStaffList(staffData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const updateStatus = async (id: string, newStatus: string, negotiationNotes?: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus, negotiation_notes: negotiationNotes } : req
    ))
    setNegotiatingId(null)

    const { error } = await supabase
      .from('creative_requests')
      // @ts-ignore
      .update({ status: newStatus, negotiation_notes: negotiationNotes })
      .eq('id', id)

    if (error) {
        alert('Error: ' + error.message)
    } else {
        if (newStatus === 'Negotiation') {
            alert('Negotiation message sent successfully!')
        }
    }
  }

  const assignPic = async (reqId: string, staffId: string) => {
    const { error } = await supabase
      .from('creative_requests')
      // @ts-ignore
      .update({ pic_id: parseInt(staffId) })
      .eq('id', reqId)

    if (!error) {
       const staffName = staffList.find(s => s.staff_id.toString() === staffId)?.staff_name
       setRequests(requests.map(req => req.id === reqId ? { ...req, staff: { staff_name: staffName }, pic_id: staffId } : req))
    }
  }

  const deliverResult = async () => {
    if (!deliverId || !deliverLink) return

    const { error } = await supabase
      .from('creative_requests')
      // @ts-ignore
      .update({ receivable_link: deliverLink })
      .eq('id', deliverId)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setRequests(requests.map(req => req.id === deliverId ? { ...req, receivable_link: deliverLink } : req))
      setDeliverId(null)
      setDeliverLink('')
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center italic text-[#000503]">Loading Command Center...</div>

  const toBeReviewed = requests.filter(r => r.status === 'New' || r.status === 'Negotiation')
  const waitingForDelivery = requests.filter(r => r.status === 'Accepted' && !r.receivable_link)

  const tabBase = "px-6 py-3 rounded-full font-bold italic transition shadow-md border border-transparent"
  const tabSelected = "bg-gradient-to-b from-[#00B887] to-[#000503]"
  const tabUnselected = "bg-[#000503] hover:opacity-80 text-white"

  // BUTTON STYLES
  // Logic Button: Gradient 1 Bg -> Gradient 2 Text (Flip)
  const btnLogicContainer = "group py-1 rounded-2xl font-bold italic transition shadow-md bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A] border border-transparent"
  const btnLogicText = "text-xs bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]"
  
  // Semantic Buttons (Yellow/Red/Green)
  const btnYellowContainer = "group flex-1 py-1 rounded-2xl font-bold italic transition shadow-md bg-gradient-to-b from-yellow-500 to-black hover:from-white hover:to-yellow-400"
  const btnYellowText = "text-xs bg-clip-text text-transparent bg-gradient-to-b from-white to-yellow-200 group-hover:from-yellow-600 group-hover:to-black"

  const btnRedContainer = "group flex-1 py-1 rounded-2xl font-bold italic transition shadow-md bg-gradient-to-b from-red-600 to-black hover:from-white hover:to-red-400"
  const btnRedText = "text-xs bg-clip-text text-transparent bg-gradient-to-b from-white to-red-200 group-hover:from-red-600 group-hover:to-black"

  const btnGreenContainer = "group flex-1 py-1 rounded-2xl font-bold italic transition shadow-md bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A]"
  const btnGreenText = "text-xs bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]"

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#64C07A] p-8">
      
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold italic tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-2">
          Admin Dashboard
        </h1>
        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          className="text-[#000503] hover:text-[#00B887] text-sm italic underline font-bold"
        >
          Log out
        </button>
      </div>

      <div className="flex gap-4 mb-10 max-w-7xl mx-auto">
        <button onClick={() => setActiveTab('review')} className={`${tabBase} ${activeTab === 'review' ? tabSelected : tabUnselected}`}>
           <span className={activeTab === 'review' ? "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A]" : ""}>
             To be reviewed
             <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">{toBeReviewed.length}</span>
           </span>
        </button>

        <button onClick={() => setActiveTab('delivery')} className={`${tabBase} ${activeTab === 'delivery' ? tabSelected : tabUnselected}`}>
           <span className={activeTab === 'delivery' ? "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A]" : ""}>
             Waiting for delivery
             <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">{waitingForDelivery.length}</span>
           </span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* --- TO BE REVIEWED --- */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {toBeReviewed.map(req => (
              <div key={req.id} className="p-[1px] rounded-2xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-lg">
                <div className="bg-white p-6 rounded-2xl h-full flex flex-col relative">
                    <div className="absolute top-4 right-4 text-xs font-mono text-gray-400">{new Date(req.created_at).toLocaleDateString()}</div>
                    
                    <h3 className="text-xl font-bold italic mb-1 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-1">
                        {req.project_title}
                    </h3>
                    <p className="text-xs text-[#00B887] italic mb-4 font-bold">{req.project_type}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
                      <p>From: <span className="text-[#000503] font-bold">{req.applicant_name}</span></p>
                      <p>Deadline: <span className="text-[#000503] font-bold">{req.requested_deadline}</span></p>
                      <a href={req.brief_link} target="_blank" className="text-[#00B887] underline text-xs hover:text-[#000503]">View Brief Assets</a>
                    </div>

                    <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <label className="text-xs text-gray-500 block mb-1 font-bold italic">Assign PIC:</label>
                      <select 
                        className="w-full bg-white text-[#000503] text-xs p-2 rounded-xl border border-gray-300 focus:border-[#00B887] outline-none font-medium font-poppins"
                        value={req.pic_id || ""}
                        onChange={(e) => assignPic(req.id, e.target.value)}
                      >
                        <option value="">Select Staff...</option>
                        {staffList.map(s => <option key={s.staff_id} value={s.staff_id}>{s.staff_name}</option>)}
                      </select>
                    </div>

                    {negotiatingId === req.id ? (
                      <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                        <textarea className="w-full bg-white text-black text-xs p-2 rounded mb-2 border border-gray-300" placeholder="Negotiation notes..." onChange={e => setNotes(e.target.value)}/>
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(req.id, 'Negotiation', notes)} className="bg-[#00B887] text-white text-xs font-bold px-3 py-1 rounded hover:opacity-90">Send</button>
                          <button onClick={() => setNegotiatingId(null)} className="text-gray-500 text-xs hover:text-black">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => setNegotiatingId(req.id)} className={btnYellowContainer}>
                          <span className={btnYellowText}>Negotiate</span>
                        </button>
                        <button onClick={() => updateStatus(req.id, 'Rejected')} className={btnRedContainer}>
                          <span className={btnRedText}>Reject</span>
                        </button>
                        <button onClick={() => updateStatus(req.id, 'Accepted')} className={btnGreenContainer}>
                          <span className={btnGreenText}>Accept</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
             {toBeReviewed.length === 0 && <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border border-white"><p className="text-gray-500 italic">All caught up! No new requests.</p></div>}
          </div>
        )}

        {/* --- WAITING FOR DELIVERY --- */}
        {activeTab === 'delivery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {waitingForDelivery.map(req => (
              <div key={req.id} className="p-[1px] rounded-2xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-lg">
                <div className="bg-white p-6 rounded-2xl h-full relative">
                    <div className="absolute top-0 right-0 bg-[#00B887] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">IN PROGRESS</div>
                    
                    <h3 className="text-xl font-bold italic mb-1 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] pb-1">
                        {req.project_title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 font-medium">PIC: <span className="text-[#00B887] font-bold">{req.staff?.staff_name || 'Unassigned'}</span></p>

                    {deliverId === req.id ? (
                      // INPUT COMPONENT (Visible when button is clicked)
                      <div className="mt-4 bg-gray-100 p-3 rounded-xl border border-[#00B887]">
                        <label className="text-[10px] text-[#00B887] uppercase font-bold mb-1 block">Google Drive Link</label>
                        <input type="text" className="w-full bg-white text-black text-xs p-2 rounded-lg border border-gray-300 mb-2 focus:border-[#00B887] outline-none" placeholder="https://drive.google.com..." onChange={(e) => setDeliverLink(e.target.value)} />
                        
                        <div className="flex gap-2 items-center">
                          <button onClick={deliverResult} className={`flex-1 ${btnLogicContainer}`}>
                            <span className={btnLogicText}>Confirm</span>
                          </button>
                          <button onClick={() => setDeliverId(null)} className="text-gray-500 text-xs px-2 hover:text-black font-bold italic">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      // DELIVER BUTTON (Visible initially)
                      <button onClick={() => setDeliverId(req.id)} className={`mt-4 w-full ${btnLogicContainer}`}>
                        <span className={btnLogicText}>Deliver Result</span>
                      </button>
                    )}
                </div>
              </div>
            ))}
             {waitingForDelivery.length === 0 && <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border border-white"><p className="text-gray-500 italic">No projects currently in progress.</p></div>}
          </div>
        )}

      </div>
    </main>
  )
}