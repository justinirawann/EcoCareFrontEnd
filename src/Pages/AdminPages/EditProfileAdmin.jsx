import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

function EditProfileAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [originalPassword, setOriginalPassword] = useState('')
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
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    
    // Real-time validation
    if (field === 'name' && value && !validateName(value)) {
      setErrors({ ...errors, name: 'Nama hanya boleh berisi huruf dan spasi (min. 2 karakter)' })
    }
    
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Format email tidak valid' })
    }
    
    if (field === 'phone' && value && !validatePhone(value)) {
      setErrors({ ...errors, phone: 'Nomor telepon hanya boleh berisi angka (min. 10 digit)' })
    }
    
    if (field === 'confirmPassword' && value && value !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'Konfirmasi password tidak sama' })
    }
  }

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null')
    if (savedUser) {
      setFormData({
        name: savedUser.name || '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
        address: savedUser.address || '',
        image: null
      })
      if (savedUser.image) {
        setImagePreview(`http://127.0.0.1:8000/storage/${savedUser.image}`)
      }
    }
  }, [])



  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate before submit
    const newErrors = {}
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Nama hanya boleh berisi huruf dan spasi (min. 2 karakter)'
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Nomor telepon hanya boleh berisi angka (min. 10 digit)'
    }
    
    if (showPasswordForm) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password tidak sama'
      }
      
      if (formData.password === originalPassword) {
        newErrors.password = 'Password tidak bisa sama seperti sebelumnya'
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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

      const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile berhasil diupdate!')
        
        // Update localStorage/sessionStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
        const updatedUser = { ...currentUser, ...data.user }
        
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        } else {
          sessionStorage.setItem('user', JSON.stringify(updatedUser))
        }
        
        setTimeout(() => navigate('/admin/dashboard'), 2000)
      } else {
        setError(data.message || 'Gagal update profile')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat update profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('edit_profile_admin')}</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Admin')}&background=dc2626&color=fff&size=120`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-red-300"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name_required')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email_required')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone_number_required')}</label>
              <input
                type="text"
                placeholder={t('phone_placeholder')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-red-500'
                }`}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('address_required')}</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
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
                      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
                      setErrors({ ...errors, password: '', confirmPassword: '' })
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {showPasswordForm ? t('cancel_change_password') : t('change_password')}
                </button>
              </div>
              
              {showPasswordForm && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('new_password_placeholder')}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-red-500'
                      }`}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                  
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('confirm_new_password_placeholder')}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-red-500'
                      }`}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? '👁️' : '👁️🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? t('saving') : t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfileAdmin