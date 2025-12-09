import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../api/api"

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"))
    setUser(savedUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-20 px-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-xl border border-green-100">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Selamat datang kembali, <span className="font-semibold">{user?.name}</span> 👋
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div 
            onClick={() => navigate("/admin/reports")}
            className="p-6 border rounded-xl bg-green-100 cursor-pointer hover:bg-green-200 transition"
          >
            <h3 className="text-lg font-semibold text-green-700">Verifikasi Laporan</h3>
            <p className="text-gray-700 mt-1">
              Kelola laporan sampah dari masyarakat.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-green-100">
            <h3 className="text-lg font-semibold text-green-700">Manajemen User</h3>
            <p className="text-gray-700 mt-1">
              Lihat & kelola data pengguna.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
