import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name) && name.trim().length >= 2
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
    
    // Real-time validation
    if (field === "name" && value && !validateName(value)) {
      setErrors({ ...errors, name: "Nama hanya boleh berisi huruf dan spasi" })
    }
    
    if (field === "email" && value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Format email tidak valid" })
    }
    
    if (field === "confirmPassword" && value && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: "Password tidak sama" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate before submit
    const newErrors = {}
    
    if (!validateName(formData.name)) {
      newErrors.name = "Nama hanya boleh berisi huruf dan spasi (min. 2 karakter)"
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }
    
    if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="contoh@email.com"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password (min. 6 karakter)"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition ${
                  errors.password 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password"
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                }`}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? "👁️" : "👁️🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
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
