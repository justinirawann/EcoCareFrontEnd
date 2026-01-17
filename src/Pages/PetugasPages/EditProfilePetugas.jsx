import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from '../../contexts/LanguageContext'

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [originalPassword, setOriginalPassword] = useState("")
  const navigate = useNavigate()
  const { t } = useLanguage()

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name) && name.trim().length >= 2
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s()]+$/
    return phoneRegex.test(phone) && phone.replace(/[^0-9]/g, '').length >= 10
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
    
    // Real-time validation
    if (field === "name" && value && !validateName(value)) {
      setErrors({ ...errors, name: "Nama hanya boleh berisi huruf dan spasi (min. 2 karakter)" })
    }
    
    if (field === "email" && value && !validateEmail(value)) {
      setErrors({ ...errors, email: "Format email tidak valid" })
    }
    
    if (field === "phone" && value && !validatePhone(value)) {
      setErrors({ ...errors, phone: "Nomor telepon hanya boleh berisi angka (min. 10 digit)" })
    }
    
    if (field === "confirmPassword" && value && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: "Konfirmasi password tidak sama" })
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      
      try {
        const response = await fetch("https://ecocare-api.up.railway.app/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          console.log('User data from API:', userData)
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            password: "",
            confirmPassword: "",
            image: null
          })
          
          if (userData.image) {
            setImagePreview(`https://ecocare-api.up.railway.app/storage/${userData.image}`)
          } else {
            setImagePreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=1d4ed8&color=fff&size=200`)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    
    fetchUserData()
  }, [])

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
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Nomor telepon hanya boleh berisi angka (min. 10 digit)"
    }
    
    if (showPasswordForm) {
      if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter"
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak sama"
      }
      
      if (formData.password === originalPassword) {
        newErrors.password = "Password tidak bisa sama seperti sebelumnya"
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('address', formData.address)
      if (showPasswordForm && formData.password) {
        formDataToSend.append('password', formData.password)
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }
      formDataToSend.append('_method', 'PUT')

      const response = await fetch("https://ecocare-api.up.railway.app/api/profile/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Gagal update profile")
        return
      }

      const storage = localStorage.getItem("token") ? localStorage : sessionStorage
      storage.setItem("user", JSON.stringify(data.user))

      alert("Profile berhasil diupdate!")
      navigate("/petugas/dashboard")
    } catch (error) {
      console.error(error)
      alert("Server error!")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg shadow-xl rounded-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          {t('edit_profile_officer')} 👮‍♂️
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image */}
          <div className="text-center">
            <div className="mb-4">
              <img
                src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=16a34a&color=fff&size=200`}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-200 shadow-lg"
              />
            </div>
            <label className="cursor-pointer bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              📷 {t('choose_profile_photo')}
            </label>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name_required')}</label>
            <input
              type="text"
              placeholder={t('full_name_placeholder')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email_required')}</label>
            <input
              type="email"
              placeholder={t('email_placeholder')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone_number_required')}</label>
            <input
              type="text"
              placeholder={t('phone_placeholder')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
                errors.phone 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              }`}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('address_required')}</label>
            <textarea
              placeholder={t('address_placeholder')}
              className="w-full px-4 py-3 border rounded-xl min-h-[80px] focus:ring-2 focus:ring-green-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            ></textarea>
          </div>

          {/* Password Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm)
                  if (!showPasswordForm) {
                    setFormData({ ...formData, password: "", confirmPassword: "" })
                    setErrors({ ...errors, password: "", confirmPassword: "" })
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showPasswordForm ? t('cancel_change_password') : t('change_password')}
              </button>
            </div>
            
            {showPasswordForm && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('new_password_placeholder')}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 transition ${
                      errors.password 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    }`}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
                
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('confirm_new_password_placeholder')}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 transition ${
                      errors.confirmPassword 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    }`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? t('saving') : t('save_profile')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/petugas/dashboard")}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-600"
            >
              {t('cancel')}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {t('required_fields_note_officer')}
        </p>
      </div>
    </div>
  )
}

export default EditProfile