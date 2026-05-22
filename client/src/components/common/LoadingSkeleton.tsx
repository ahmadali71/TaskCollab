export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-64">
        <header className="h-16 bg-white border-b border-gray-200 animate-pulse">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LoadingSkeleton