import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
      console.log("Saved user:", savedUser)
      if (savedUser) {
        setFormData({
          name: savedUser.name || "",
          email: savedUser.email || "",
          phone: savedUser.phone || "",
          address: savedUser.address || "",
          password: ""
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Gagal update profile")
        return
      }

      // Update user data di storage
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage
      storage.setItem("user", JSON.stringify(data.user))

      alert("Profile berhasil diupdate!")
      navigate("/dashboard")
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
          Edit Profile 👤
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama lengkap"
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
              placeholder="email@example.com"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              placeholder="Alamat lengkap"
              className="w-full px-4 py-3 border rounded-xl min-h-[80px] focus:ring-2 focus:ring-green-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            ></textarea>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin ubah password"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah password</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
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

export default EditProfile