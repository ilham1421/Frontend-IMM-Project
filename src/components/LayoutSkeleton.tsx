export default function LayoutSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton — matches w-64 */}
      <aside className="w-64 bg-[#111111] min-h-screen flex flex-col animate-pulse">
        <div className="px-4 py-5 border-b border-white/6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div>
            <div className="h-3.5 w-24 bg-white/10 rounded mb-1" />
            <div className="h-2.5 w-16 bg-white/5 rounded" />
          </div>
        </div>
        <div className="flex-1 py-3 px-2 space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-9 bg-white/5 rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 bg-imm-gray overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 h-14" />
        <div className="p-6">
          <div className="space-y-6 animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-39" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-30" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
