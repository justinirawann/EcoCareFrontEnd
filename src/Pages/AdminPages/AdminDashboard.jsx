import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../../api/api"

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
    setUser(savedUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-700">🏛️ EcoCare Admin</h1>
          </div>
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-2 transition-colors"
              >
                <img
                  src={user?.image ? `http://127.0.0.1:8000/storage/${user.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=dc2626&color=fff&size=40`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-300 shadow-sm"
                />
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <Link
                    to="/admin/edit-profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Edit Profile
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard Admin 🏛️</h2>
              <p className="text-red-100">Kelola sistem EcoCare dengan kontrol penuh</p>
            </div>
            <div className="text-right">
              <p className="text-red-100 text-sm">Halo, {user?.name}! 👋</p>
              <p className="text-red-200 text-xs">Administrator EcoCare</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div 
            onClick={() => navigate("/admin/reports")}
            className="p-6 border rounded-xl bg-green-100 cursor-pointer hover:bg-green-200 transition"
          >
            <h3 className="text-lg font-semibold text-green-700">📝 Verifikasi Laporan</h3>
            <p className="text-gray-700 mt-1">
              Kelola laporan sampah dari masyarakat.
            </p>
          </div>

          <div 
            onClick={() => navigate("/admin/recycling")}
            className="p-6 border rounded-xl bg-blue-100 cursor-pointer hover:bg-blue-200 transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">♻️ Kelola Daur Ulang</h3>
            <p className="text-gray-700 mt-1">
              Review pesanan daur ulang dan tentukan harga.
            </p>
          </div>





          <div 
            onClick={() => navigate("/admin/articles")}
            className="p-6 border rounded-xl bg-red-100 cursor-pointer hover:bg-red-200 transition"
          >
            <h3 className="text-lg font-semibold text-red-700">📰 Kelola Artikel</h3>
            <p className="text-gray-700 mt-1">
              Buat, edit, dan hapus artikel edukasi.
            </p>
          </div>

          <div 
            onClick={() => navigate("/admin/users")}
            className="p-6 border rounded-xl bg-indigo-100 cursor-pointer hover:bg-indigo-200 transition"
          >
            <h3 className="text-lg font-semibold text-indigo-700">👥 User Management</h3>
            <p className="text-gray-700 mt-1">
              Kelola user dan petugas dengan password default.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
