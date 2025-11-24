import Link from 'next/link'

export default function RegulationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#00B887] to-[#000503] flex flex-col items-center justify-center p-4">
      
      {/* FIX: Added 'pb-2' to prevent the 'g' tail from being clipped */}
      <h1 className="text-5xl font-bold italic mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-[#64C07A] pb-2">
        Regulation
      </h1>
      
      <p className="text-white italic mb-10 text-center max-w-md text-sm font-medium leading-relaxed">
        The complete guide to DWDG creative requests is currently being updated. Please check back later for the full PDF documentation.
      </p>
      
      <Link href="/">
        <button className="group px-8 py-3 rounded-full font-bold italic transition shadow-lg bg-gradient-to-b from-white to-[#64C07A] hover:from-[#00B887] hover:to-[#000503]">
          {/* Also added pb-1 here just in case */}
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#00B887] to-[#000503] group-hover:from-white group-hover:to-[#64C07A] pb-1">
            Back to Home
          </span>
        </button>
      </Link>
    </main>
  )
}