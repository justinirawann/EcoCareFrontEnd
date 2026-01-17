import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

function CreateRecyclingOrder() {
  const [formData, setFormData] = useState({
    category: '',
    weight: '',
    description: '',
    pickup_address: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const categories = ['Logam', 'Minyak', 'Kertas', 'Elektronik', 'Besi', 'Kaca', 'Plastik']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    // Debug: Cek user role terlebih dahulu
    try {
      const userResponse = await fetch("https://ecocare-api.up.railway.app/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userData = await userResponse.json()
      console.log('User roles:', userData.roles)
      
      if (!userData.roles || !userData.roles.includes('user')) {
        alert('Anda tidak memiliki akses untuk fitur ini. Role yang diperlukan: user')
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      alert('Gagal memverifikasi akses user')
      setLoading(false)
      return
    }

    // Lanjutkan dengan submit form
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('category', formData.category)
      formDataToSend.append('weight', formData.weight)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('pickup_address', formData.pickup_address)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await fetch("https://ecocare-api.up.railway.app/api/recycling/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()
      console.log('Response status:', response.status)
      console.log('Response data:', data)

      if (!response.ok) {
        alert(data.message || "Gagal membuat pesanan")
        return
      }

      alert("Pesanan daur ulang berhasil dibuat!")
      navigate("/dashboard/my-recycling")
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
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
            {t('sell_recycling_waste_title')} ♻️
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6" onClick={(e) => {
            if (!e.target.closest('.relative')) {
              setIsDropdownOpen(false)
            }
          }}>
            {/* Kategori Sampah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('waste_category')}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-left focus:ring-2 focus:ring-green-500 focus:border-green-500 flex justify-between items-center hover:border-gray-400 transition-colors"
                >
                  <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.category || t('select_waste_category')}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                    <div className="py-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: cat })
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-green-50 hover:text-green-700 transition-colors ${
                            formData.category === cat ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-900'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">
                              {cat === 'Logam' && '🔩'}
                              {cat === 'Minyak' && '🛢️'}
                              {cat === 'Kertas' && '📄'}
                              {cat === 'Elektronik' && '📱'}
                              {cat === 'Besi' && '⚙️'}
                              {cat === 'Kaca' && '🪟'}
                              {cat === 'Plastik' && '🥤'}
                            </span>
                            {cat}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Berat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('weight_kg')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder={t('weight_placeholder')}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>

            {/* Gambar Sampah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('waste_photo')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-2">{t('photo_selected_success')}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-600 mb-2">{t('select_waste_photo')}</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                >
                  {imagePreview ? t('change_photo') : t('select_photo')}
                </label>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('waste_description')}
              </label>
              <textarea
                placeholder={t('waste_description_placeholder')}
                className="w-full px-4 py-3 border rounded-xl min-h-[100px] focus:ring-2 focus:ring-green-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {/* Alamat Penjemputan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pickup_address')}
              </label>
              <textarea
                placeholder={t('pickup_address_placeholder')}
                className="w-full px-4 py-3 border rounded-xl min-h-[80px] focus:ring-2 focus:ring-green-500"
                value={formData.pickup_address}
                onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                required
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !formData.category}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? t('sending') : t('send_order')}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-600"
              >
                {t('cancel')}
              </button>
            </div>
          </form>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">💡 {t('info')}</h4>
            <p className="text-blue-800 text-sm">
              {t('admin_price_info')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRecyclingOrder