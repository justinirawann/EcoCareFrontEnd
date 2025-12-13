import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ManageRecycling() {
  const [orders, setOrders] = useState([])
  const [petugas, setPetugas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedAssign, setSelectedAssign] = useState(null)
  const [selectedPetugas, setSelectedPetugas] = useState('')
  const [priceData, setPriceData] = useState({ price_per_kg: '', admin_notes: '' })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const [ordersResponse, usersResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/recycling", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://127.0.0.1:8000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      if (ordersResponse.ok && usersResponse.ok) {
        const ordersData = await ordersResponse.json()
        const usersData = await usersResponse.json()
        setOrders(ordersData.orders)
        const petugasOnly = usersData.filter(user => user.roles?.[0]?.slug === 'petugas')
        setPetugas(petugasOnly)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (orderId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/recycling/${orderId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(priceData)
      })

      if (response.ok) {
        alert("Pesanan berhasil disetujui!")
        setSelectedOrder(null)
        setPriceData({ price_per_kg: '', admin_notes: '' })
        fetchOrders()
      }
    } catch (error) {
      console.error("Error approving order:", error)
    }
  }

  const handleReject = async (orderId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/recycling/${orderId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ admin_notes: priceData.admin_notes })
      })

      if (response.ok) {
        alert("Pesanan ditolak!")
        setSelectedOrder(null)
        setPriceData({ price_per_kg: '', admin_notes: '' })
        fetchOrders()
      }
    } catch (error) {
      console.error("Error rejecting order:", error)
    }
  }

  const handleAssign = async (orderId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/recycling/${orderId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ petugas_id: selectedPetugas })
      })

      if (response.ok) {
        alert("Petugas berhasil ditugaskan!")
        setSelectedAssign(null)
        setSelectedPetugas('')
        fetchOrders()
      }
    } catch (error) {
      console.error("Error assigning petugas:", error)
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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-blue-700">Kelola Pesanan Daur Ulang</h1>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {order.category} - {order.weight} kg
                  </h3>
                  <p className="text-gray-600">#{order.id} - {order.user.name}</p>
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

              {order.status === 'Pending' && (
                <div className="border-t pt-4">
                  {selectedOrder === order.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga per kg (Rp)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={priceData.price_per_kg}
                          onChange={(e) => setPriceData({...priceData, price_per_kg: e.target.value})}
                          placeholder="Masukkan harga per kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catatan Admin
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg"
                          value={priceData.admin_notes}
                          onChange={(e) => setPriceData({...priceData, admin_notes: e.target.value})}
                          placeholder="Catatan untuk user"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Review Pesanan
                    </button>
                  )}
                </div>
              )}

              {order.status === 'Approved' && (
                <div className="border-t pt-4">
                  {selectedAssign === order.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pilih Petugas
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg"
                          value={selectedPetugas}
                          onChange={(e) => setSelectedPetugas(e.target.value)}
                        >
                          <option value="">Pilih petugas...</option>
                          {petugas.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAssign(order.id)}
                          disabled={!selectedPetugas}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Tugaskan
                        </button>
                        <button
                          onClick={() => setSelectedAssign(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssign(order.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      🚛 Tugaskan Petugas
                    </button>
                  )}
                </div>
              )}

              {order.price_per_kg && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Harga per kg</p>
                      <p className="font-semibold text-green-600">Rp {Number(order.price_per_kg).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Harga</p>
                      <p className="font-bold text-green-600">Rp {Number(order.total_price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold">{order.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {order.petugas && (
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500">Petugas yang Ditugaskan</p>
                  <p className="font-semibold text-blue-800">{order.petugas.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageRecycling