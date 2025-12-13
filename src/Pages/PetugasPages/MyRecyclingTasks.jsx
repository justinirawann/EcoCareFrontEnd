import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MyRecyclingTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/petugas/recycling-tasks", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const response = await fetch(`http://127.0.0.1:8000/api/petugas/recycling/${taskId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_status: status }),
      })

      if (!response.ok) throw new Error('Failed to update payment')

      setSuccess(`Status pembayaran berhasil diubah ke ${status === 'paid' ? 'Lunas' : 'Belum Bayar'}`)
      fetchTasks()
    } catch (err) {
      setError('Gagal update status pembayaran')
      console.error(err)
    }
  }

  const handleComplete = async (taskId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/petugas/recycling/${taskId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSuccess("Pesanan berhasil diselesaikan!")
        fetchTasks()
      }
    } catch (error) {
      setError("Gagal menyelesaikan pesanan")
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Berjalan': return 'bg-green-100 text-green-800'
      case 'Selesai': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat tugas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/petugas/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-blue-700">Tugas Penjemputan Daur Ulang</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Tugas</h3>
            <p className="text-gray-500">Anda belum memiliki tugas penjemputan daur ulang</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {task.category} - {task.weight} kg
                    </h3>
                    <p className="text-gray-600">#{task.id} - {task.user.name}</p>
                    <p className="text-sm text-gray-500">📞 {task.user.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {task.image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Foto Sampah</p>
                      <img
                        src={`http://127.0.0.1:8000/storage/${task.image}`}
                        alt="Sampah"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Deskripsi</p>
                    <p className="text-gray-800">{task.description || 'Tidak ada deskripsi'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat Penjemputan</p>
                    <p className="text-gray-800 font-medium">{task.pickup_address}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Harga per kg</p>
                      <p className="font-semibold text-green-600">
                        Rp {Number(task.price_per_kg).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Berat</p>
                      <p className="font-semibold">{task.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Nilai</p>
                      <p className="text-xl font-bold text-green-600">
                        Rp {Number(task.total_price).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status Pembayaran</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        task.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {task.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </div>
                  </div>
                </div>

                {task.admin_notes && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-500">Catatan Admin</p>
                    <p className="text-blue-800">{task.admin_notes}</p>
                  </div>
                )}

                {task.status === 'Berjalan' && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {task.payment_status === 'unpaid' ? (
                        <button
                          onClick={() => updatePaymentStatus(task.id, 'paid')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          💰 Tandai Lunas
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePaymentStatus(task.id, 'unpaid')}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-medium"
                        >
                          ❌ Tandai Belum Bayar
                        </button>
                      )}
                      
                      {task.payment_status === 'paid' && (
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                        >
                          ✅ Selesaikan Penjemputan
                        </button>
                      )}
                    </div>
                    
                    {task.payment_status === 'unpaid' && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          ⚠️ Pastikan user sudah membayar sebelum menyelesaikan penjemputan
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {task.status === 'Selesai' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-center text-gray-600 font-medium">
                      ✅ Penjemputan telah selesai
                    </p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  Dibuat: {new Date(task.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRecyclingTasks