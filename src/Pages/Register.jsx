import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!")
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Registrasi gagal")
        return
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token)

      alert("Registrasi berhasil!")
      navigate("/login")
    } catch (error) {
      console.error(error)
      alert("Server error!")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center px-4">
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-green-100">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 transition"
        >
          ← Kembali
        </button>

        {/* Brand */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-extrabold text-green-700">EcoCare</h1>
          <p className="text-gray-500 mt-1">
            Daftar untuk mulai peduli lingkungan 🌱
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama lengkap kamu"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="contoh@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              placeholder="Ulangi password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition duration-150"
          >
            Daftar
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
