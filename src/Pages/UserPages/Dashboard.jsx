import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProfileIncompleteModal from './components/ProfileIncompleteModal'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    
    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    window.location.href = "/"
  }

  const checkProfileComplete = (user) => {
    if (!user) return false
    const requiredFields = ['name', 'email', 'phone', 'address', 'image']
    return requiredFields.every(field => user[field] && user[field].toString().trim() !== '')
  }

  const handleCreateReport = () => {
    if (checkProfileComplete(user)) {
      navigate('/dashboard/create-report')
    } else {
      setShowModal(true)
    }
  }

  const handleCreateRecycling = () => {
    if (checkProfileComplete(user)) {
      navigate('/dashboard/create-recycling')
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-700">♻️ EcoCare</h1>
          </div>
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-2 transition-colors"
              >
                <img
                  src={user?.image ? `http://127.0.0.1:8000/storage/${user.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=16a34a&color=fff&size=40`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-green-300 shadow-sm"
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
                    to="/dashboard/edit-profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
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
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bersama Jaga Lingkungan! 🌍</h2>
              <p className="text-green-100">Laporkan sampah, pantau status, dan berkontribusi untuk lingkungan yang lebih bersih</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Halo, {user?.name}! 👋</p>
              <p className="text-green-200 text-xs">Mari jaga lingkungan bersama</p>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fitur Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div 
              onClick={handleCreateReport}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">📍</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Buat Laporan Baru</h3>
                <p className="text-gray-600 text-sm mb-3">Laporkan tumpukan sampah atau masalah kebersihan di sekitar Anda</p>
                <span className="text-green-600 font-semibold text-sm">→ Buat Sekarang</span>
              </div>
            </div>
            
            <Link 
              to="/dashboard/my-reports" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Laporan Saya</h3>
                <p className="text-gray-600 text-sm mb-3">Pantau status laporan Anda dan lihat feedback dari admin</p>
                <span className="text-blue-600 font-semibold text-sm">→ Lihat Status</span>
              </div>
            </Link>

            <div 
              onClick={handleCreateRecycling}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">♻️</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Jual Sampah Daur Ulang</h3>
                <p className="text-gray-600 text-sm mb-3">Jual sampah daur ulang Anda dengan harga terbaik</p>
                <span className="text-green-600 font-semibold text-sm">→ Mulai Jual</span>
              </div>
            </div>
            
            <Link 
              to="/dashboard/my-recycling"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Pesanan Daur Ulang</h3>
                <p className="text-gray-600 text-sm mb-3">Lihat status pesanan daur ulang Anda</p>
                <span className="text-blue-600 font-semibold text-sm">→ Lihat Pesanan</span>
              </div>
            </Link>

            <Link 
              to="/articles"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Artikel Edukasi</h3>
                <p className="text-gray-600 text-sm mb-3">Tips & panduan menjaga lingkungan</p>
                <span className="text-purple-600 font-semibold text-sm">→ Baca Artikel</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-2">💡 Tips</h4>
          <p className="text-blue-800 text-sm">Pastikan foto yang Anda upload jelas dan deskripsi lengkap agar laporan dapat diproses dengan cepat!</p>
        </div>
      </div>
      
      <ProfileIncompleteModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  )
}

export default Dashboard