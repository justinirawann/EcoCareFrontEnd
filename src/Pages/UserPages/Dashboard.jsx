import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Dashboard() {
  const [user, setUser] = useState(null)
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
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-700">♻️ EcoCare</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bersama Jaga Lingkungan! 🌍</h2>
              <p className="text-green-100">Laporkan sampah, pantau status, dan berkontribusi untuk lingkungan yang lebih bersih</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/edit-profile")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              👤 Edit Profile
            </button>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fitur Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/dashboard/create-report" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📍</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Buat Laporan Baru</h3>
                  <p className="text-gray-600 text-sm">Laporkan tumpukan sampah atau masalah kebersihan di sekitar Anda dengan mudah</p>
                  <span className="inline-block mt-3 text-green-600 font-semibold text-sm">→ Buat Sekarang</span>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/dashboard/my-reports" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">📋</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Laporan Saya</h3>
                  <p className="text-gray-600 text-sm">Pantau status laporan Anda dan lihat feedback dari admin</p>
                  <span className="inline-block mt-3 text-blue-600 font-semibold text-sm">→ Lihat Status</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Features */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fitur Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer opacity-60">
              <div className="text-3xl mb-3">♻️</div>
              <h4 className="font-semibold text-gray-800 mb-1">Daur Ulang</h4>
              <p className="text-gray-500 text-sm">Segera hadir</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer opacity-60">
              <div className="text-3xl mb-3">🚛</div>
              <h4 className="font-semibold text-gray-800 mb-1">Pengangkutan</h4>
              <p className="text-gray-500 text-sm">Segera hadir</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer opacity-60">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="font-semibold text-gray-800 mb-1">Edukasi</h4>
              <p className="text-gray-500 text-sm">Segera hadir</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-2">💡 Tips</h4>
          <p className="text-blue-800 text-sm">Pastikan foto yang Anda upload jelas dan deskripsi lengkap agar laporan dapat diproses dengan cepat!</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard