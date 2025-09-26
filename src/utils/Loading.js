import React from 'react'
import { Users } from 'lucide-react'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <Users className="absolute inset-0 m-auto h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Users</h3>
          <p className="text-gray-600 text-sm">Please wait...</p>
        </div>
      </div>
  )
}

export default Loading