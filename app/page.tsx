'use client' // This tells Next.js: "This runs in the browser, not just the server"

import { useEffect, useState } from 'react'
import { createClient } from './lib/supabase'

export default function Home() {
  // 1. State to hold the data
  const [types, setTypes] = useState<any[]>([])

  useEffect(() => {
    // 2. Function to fetch data
    const fetchTypes = async () => {
      const supabase = createClient()
      
      // The Query: Select everything (*) from 'type_description'
      const { data, error } = await supabase
        .from('type_description')
        .select('*')

      if (error) console.log('Error:', error)
      if (data) setTypes(data)
    }

    fetchTypes()
  }, [])

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Creative Request Hub</h1>
      
      <div className="border p-4 rounded-lg bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Database Connection Test:
        </h2>
        
        {/* 3. Loop through the data and display it */}
        <ul className="space-y-2">
          {types.map((type) => (
            <li key={type.type_name} className="flex justify-between bg-gray-800 p-3 rounded">
              <span>{type.type_name}</span>
              <span className="text-gray-400">{type.work_duration} days</span>
            </li>
          ))}
        </ul>
        
        {types.length === 0 && <p>Loading data...</p>}
      </div>
    </main>
  );
}