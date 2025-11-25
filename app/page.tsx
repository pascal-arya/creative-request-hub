'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    { q: "How long our request will be delivered?", a: "It depends on the complexity. Usually 2-5 days." },
    { q: "Does the verification message on email immediate?", a: "Yes, you will receive an automated confirmation immediately." },
    { q: "Why we can't edit request during progress?", a: "To ensure the creative team works on a stable brief. Contact admin for critical changes." }
  ]

  // BUTTON STYLE CONSTANTS (To ensure consistency)
  // Container: Gradient 1 (Default) -> Gradient 2 (Hover)
  const btnContainer = "group relative px-8 py-3 rounded-full font-bold italic transition shadow-lg bg-gradient-to-b from-[#00B887] to-[#000503] hover:from-white hover:to-[#64C07A]"
  // Text: Gradient 2 (Default) -> Gradient 1 (Hover)
  const btnText = "bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]"

  return (
    <main className="min-h-screen bg-white pb-20">

      {/* 1. HERO SECTION */}
      <section className="text-center pt-24 pb-16 px-4">
        <h1 className="text-5xl md:text-7xl font-bold italic mb-6 tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
            Act through<br />Structure
          </span>
        </h1>

        <p className="text-[#000503] italic mb-10 max-w-md mx-auto text-sm font-medium">
          Normalize & automate hub for internal dwdg art. The fastest team to plan requests and event banners.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link href="/request" className="w-full md:w-auto">
            <button className={`w-full md:w-auto ${btnContainer}`}>
              <span className={btnText}>Apply your creative request</span>
            </button>
          </Link>
          <Link href="/track" className="w-full md:w-auto">
            <button className={`w-full md:w-auto ${btnContainer}`}>
              <span className={btnText}>Track your application</span>
            </button>
          </Link>
        </div>
      </section>

      {/* 2. CARDS SECTION */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
        <h2 className="text-center text-xl font-bold italic mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
          What can you do here?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - Stroke reduced to p-[1px] */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-md">
            <div className="bg-gradient-to-b from-white to-[#64C07A] p-8 rounded-2xl h-full flex flex-col justify-between items-start text-left">
              <div className="mb-6">
                <h3 className="font-bold text-2xl italic mb-2 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
                  Watch your idea<br />come true!
                </h3>
                <p className="text-[#000503] text-xs italic">
                  Send your creative brief via form and let us handle the rest.
                </p>
              </div>
              <Link href="/request" className="w-full">
                <button className={`w-full ${btnContainer}`}>
                  <span className={btnText}>Apply your request</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2 - Stroke reduced to p-[1px] */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-md">
            <div className="bg-gradient-to-b from-white to-[#64C07A] p-8 rounded-2xl h-full flex flex-col justify-between items-start text-left">
              <div className="mb-6">
                <h3 className="font-bold text-2xl italic mb-2 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
                  Track your<br />application
                </h3>
                <p className="text-[#000503] text-xs italic">
                  Monitor the progress of your request in real-time.
                </p>
              </div>
              <Link href="/track" className="w-full">
                <button className={`w-full ${btnContainer}`}>
                  <span className={btnText}>View your application</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROCESS STEPS */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
        <h2 className="text-center text-xl font-bold italic mb-10 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
          How your request are done?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { step: "1", title: "Apply", desc: "Fill the request form with detailed brief & assets." },
            { step: "2", title: "Wait for verification", desc: "We will review if the request fits our capacity." },
            { step: "3", title: "Negotiate", desc: "If needed, we discuss deadlines or details." },
            { step: "4", title: "Collect", desc: "Receive your assets via Google Drive link." }
          ].map((item) => (
            // Process Cards - Stroke reduced to p-[1px]
            <div key={item.step} className="p-[1px] rounded-2xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-lg">
              <div className="flex items-center gap-4 bg-gradient-to-b from-white to-[#64C07A] p-6 rounded-2xl h-full">
                <div className="text-4xl font-bold italic bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">{item.step}</div>
                <div>
                  <h3 className="font-bold italic text-[#000503] text-lg">{item.title}</h3>
                  <p className="text-xs text-[#000503]/70 italic font-medium">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regulation Button - Same new style */}
        <div className="text-center mt-8">
          <Link href="/regulation">
            <button className={btnContainer}>
              <span className={`text-xs ${btnText}`}>
                READ OUR COMPLETE REGULATION
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-center text-xl font-bold italic mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503]">
          Frequently Asked Question (FAQ)
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            // FAQ Cards - Stroke reduced to p-[1px]
            <div key={index} className="p-[1px] rounded-xl bg-gradient-to-b from-[#00B887] to-[#000503] shadow-sm group">
              <div className="rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  // FAQ Button now matches others: Default Dark -> Hover Light
                  className="w-full text-left p-4 font-bold italic text-sm flex justify-between items-center transition-all 
                  bg-gradient-to-b from-[#00B887] to-[#000503] 
                  hover:from-white hover:to-[#64C07A]"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] group-hover:from-[#00B887] group-hover:to-[#000503]">
                    {faq.q}
                  </span>
                  <span className="text-white group-hover:text-[#000503] transition-colors">
                    {openFaq === index ? '-' : '+'}
                  </span>
                </button>

                {openFaq === index && (
                  <div className="bg-white p-4 text-xs text-[#000503] italic">
                    {faq.a}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}