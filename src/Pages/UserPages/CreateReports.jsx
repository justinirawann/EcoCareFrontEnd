import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from '../../contexts/LanguageContext'

function CreateReports() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !location) {
      alert("Judul dan lokasi wajib diisi!")
      return
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("location", location)
    if (photo) formData.append("photo", photo)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reports/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Gagal membuat laporan")
        return
      }

      alert("Laporan berhasil dibuat!")
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Server error!")
    }
  }

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-lg shadow-xl rounded-2xl p-8 border border-green-200">

        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-green-600 hover:text-green-700 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-extrabold text-green-700 flex-1 text-center">
            {t('create_waste_report')} ♻️
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('title')}</label>
            <input
              type="text"
              placeholder={t('title_placeholder')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
            <input
              type="text"
              placeholder={t('location_placeholder')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <textarea
              placeholder={t('description_placeholder')}
              className="w-full px-4 py-3 border rounded-xl min-h-[100px] focus:ring-2 focus:ring-green-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo')}</label>
            {photoPreview && (
              <div className="mb-3">
                <img src={photoPreview} alt="Preview" className="w-full max-w-sm rounded-lg border-2 border-green-200" />
                <p className="text-sm mt-2 text-gray-600">📸 {photo.name}</p>
              </div>
            )}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-600 font-medium">{t('click_to_select_photo')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('photo_format_info')}</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  setPhoto(file)
                  if (file) {
                    setPhotoPreview(URL.createObjectURL(file))
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-600"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700"
            >
              {t('send_report')}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CreateReports
