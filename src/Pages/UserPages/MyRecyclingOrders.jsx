import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MyRecyclingOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/recycling/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Approved': return 'bg-blue-100 text-blue-800'
      case 'Berjalan': return 'bg-green-100 text-green-800'
      case 'Selesai': return 'bg-gray-100 text-gray-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Pesanan Daur Ulang Saya</h1>
          <Link
            to="/dashboard/create-recycling"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Buat Pesanan Baru
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki pesanan daur ulang</p>
            <Link
              to="/dashboard/create-recycling"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Buat Pesanan Pertama
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {order.category} - {order.weight} kg
                    </h3>
                    <p className="text-gray-600">#{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {order.image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Foto Sampah</p>
                      <img
                        src={`http://127.0.0.1:8000/storage/${order.image}`}
                        alt="Sampah"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Deskripsi</p>
                    <p className="text-gray-800">{order.description || 'Tidak ada deskripsi'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat Penjemputan</p>
                    <p className="text-gray-800">{order.pickup_address}</p>
                  </div>
                </div>

                {order.price_per_kg && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Harga per kg</p>
                        <p className="text-lg font-semibold text-green-600">
                          Rp {Number(order.price_per_kg).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Berat</p>
                        <p className="text-lg font-semibold">{order.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Harga</p>
                        <p className="text-xl font-bold text-green-600">
                          Rp {Number(order.total_price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.petugas && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-500">Petugas yang Ditugaskan</p>
                    <p className="font-semibold text-blue-800">{order.petugas.name}</p>
                  </div>
                )}

                {order.admin_notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Catatan Admin</p>
                    <p className="text-gray-800">{order.admin_notes}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  Dibuat: {new Date(order.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyRecyclingOrders