import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const categories = ['Logam', 'Minyak', 'Kertas', 'Elektronik', 'Besi', 'Kaca', 'Plastik']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('category', formData.category)
      formDataToSend.append('weight', formData.weight)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('pickup_address', formData.pickup_address)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await fetch("http://127.0.0.1:8000/api/recycling/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

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
            Jual Sampah Daur Ulang ♻️
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kategori Sampah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Sampah *
              </label>
              <select
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Pilih kategori sampah</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Berat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berat (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Masukkan berat dalam kg"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>

            {/* Gambar Sampah */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Sampah *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-2">Foto sampah berhasil dipilih</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-600 mb-2">Pilih foto sampah</p>
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
                  {imagePreview ? 'Ganti Foto' : 'Pilih Foto'}
                </label>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Sampah
              </label>
              <textarea
                placeholder="Jelaskan kondisi dan jenis sampah secara detail"
                className="w-full px-4 py-3 border rounded-xl min-h-[100px] focus:ring-2 focus:ring-green-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {/* Alamat Penjemputan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Penjemputan *
              </label>
              <textarea
                placeholder="Alamat lengkap untuk penjemputan sampah"
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
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim Pesanan"}
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

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">💡 Info</h4>
            <p className="text-blue-800 text-sm">
              Admin akan menentukan harga per kg berdasarkan kategori dan kondisi sampah. 
              Petugas akan dijadwalkan untuk menjemput sampah di alamat yang Anda berikan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRecyclingOrder