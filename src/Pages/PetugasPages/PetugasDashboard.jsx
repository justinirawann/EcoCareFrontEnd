import { useEffect, useState } from "react"

function PetugasDashboard() {
  const [user, setUser] = useState(null)

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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-20 px-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Petugas Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Halo, <span className="font-semibold">{user?.name}</span> 👷  
          <br />
          Ini adalah panel untuk petugas lapangan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 border rounded-xl bg-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">
              Daftar Tugas Hari Ini
            </h3>
            <p className="text-gray-700 mt-1">
              Lihat tugas pengangkutan sampah yang sudah ditugaskan.
            </p>
          </div>

          <div className="p-6 border rounded-xl bg-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">
              Laporan Selesai
            </h3>
            <p className="text-gray-700 mt-1">
              Konfirmasi laporan yang sudah kamu kerjakan.
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

export default PetugasDashboard
