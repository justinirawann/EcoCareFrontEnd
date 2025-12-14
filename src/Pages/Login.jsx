import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from '../contexts/LanguageContext'

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { t, loading: langLoading, error: langError, translations } = useLanguage()
  
  // Debug: log translation status
  console.log('Login page - Language loading:', langLoading)
  console.log('Login page - Language error:', langError)
  console.log('Login page - Translations count:', Object.keys(translations).length)
  console.log('Login page - Sample translation (email):', t('email'))

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
    if (field === "email" && value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Format email tidak valid" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submit
    const newErrors = {}
    
    if (!validateEmail(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login gagal");
        return;
      }

      // Simpan token & user berdasarkan Remember Me
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      // Ambil role pertama dari array
      const roles = data.user.roles || [];
      const role = roles.length > 0 ? roles[0] : null;

      // Redirect sesuai role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "petugas") {
        navigate("/petugas/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Server error!");
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center px-4">
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-green-100">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 transition"
        >
          ← {t('back_to_home')}
        </button>

        {/* Logo / Brand */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-extrabold text-green-700">EcoCare</h1>
          <p className="text-gray-500 mt-1">
            {t('login_subtitle')} 🌱
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              placeholder={t('email_placeholder')}
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
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('password_placeholder')}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              {t('remember_me')}
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={langLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition duration-150 disabled:opacity-50"
          >
            {langLoading ? t('loading') : t('login_button')}
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          {t('no_account')}{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            {t('register_now')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
