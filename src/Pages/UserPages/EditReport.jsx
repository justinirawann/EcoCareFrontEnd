import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

function EditReport() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [currentPhoto, setCurrentPhoto] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reports/my-reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.status) {
        const report = data.data.find(r => r.id === parseInt(id))
        if (report) {
          setTitle(report.title)
          setDescription(report.description || "")
          setLocation(report.location)
          setCurrentPhoto(report.photo)
          setAdminNotes(report.admin_notes || "")
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !location) {
      alert("Judul dan lokasi wajib diisi!")
      return
    }

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("_method", "PUT")
    formData.append("title", title)
    formData.append("description", description)
    formData.append("location", location)
    if (photo) formData.append("photo", photo)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reports/${id}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Gagal update laporan")
        return
      }

      alert("Laporan berhasil diupdate!")
      navigate("/dashboard/my-reports")
    } catch (error) {
      console.error(error)
      alert("Server error!")
    }
  }

  if (loading) return <div className="min-h-screen bg-green-100 p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-lg shadow-xl rounded-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          Edit Laporan ✏️
        </h1>

        {adminNotes && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm font-semibold text-yellow-800 mb-1">💬 Catatan dari Admin:</p>
            <p className="text-sm text-yellow-700">{adminNotes}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              placeholder="Misal: Sampah menumpuk..."
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              placeholder="Misal: Jl. Melati No. 20"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              placeholder="Ceritakan kondisi sampah..."
              className="w-full px-4 py-3 border rounded-xl min-h-[100px] focus:ring-2 focus:ring-green-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
            {photoPreview ? (
              <div className="mb-3">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full max-w-sm rounded-lg border-2 border-green-200"
                />
                <p className="text-sm mt-2 text-gray-600">📸 {photo.name}</p>
              </div>
            ) : currentPhoto && (
              <div className="mb-3">
                <img 
                  src={`http://127.0.0.1:8000/storage/${currentPhoto}`} 
                  alt="Current" 
                  className="w-full max-w-sm rounded-lg border-2 border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">Foto saat ini</p>
              </div>
            )}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-600 font-medium">Klik untuk pilih foto</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 2MB)</p>
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
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700"
            >
              Update Laporan
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-reports")}
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

export default EditReport
