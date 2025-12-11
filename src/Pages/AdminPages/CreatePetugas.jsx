import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CreatePetugas() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/create-petugas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Gagal membuat petugas")
        return
      }

      alert("Petugas berhasil dibuat!")
      navigate("/admin/dashboard")
    } catch (error) {
      console.error(error)
      alert("Server error!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg shadow-xl rounded-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          Buat Akun Petugas 👷
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama petugas"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@petugas.com"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input
              type="text"
              placeholder="08123456789"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              placeholder="Alamat lengkap petugas"
              className="w-full px-4 py-3 border rounded-xl min-h-[80px] focus:ring-2 focus:ring-green-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Membuat..." : "Buat Petugas"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePetugas