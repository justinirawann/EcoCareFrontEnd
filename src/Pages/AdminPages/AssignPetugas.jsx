import { useState, useEffect } from 'react'

function AssignPetugas() {
  const [orders, setOrders] = useState([])
  const [petugas, setPetugas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedPetugas, setSelectedPetugas] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      // Fetch approved orders
      const ordersResponse = await fetch("https://ecocare-api.up.railway.app/api/admin/recycling", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Fetch petugas list
      const petugasResponse = await fetch("https://ecocare-api.up.railway.app/api/admin/petugas", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (ordersResponse.ok && petugasResponse.ok) {
        const ordersData = await ordersResponse.json()
        const petugasData = await petugasResponse.json()
        
        // Filter only approved orders
        const approvedOrders = ordersData.orders.filter(order => order.status === 'Approved')
        setOrders(approvedOrders)
        setPetugas(petugasData.petugas || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (orderId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch(`https://ecocare-api.up.railway.app/api/admin/recycling/${orderId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ petugas_id: selectedPetugas })
      })

      if (response.ok) {
        alert("Petugas berhasil ditugaskan!")
        setSelectedOrder(null)
        setSelectedPetugas('')
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning petugas:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Tugaskan Petugas</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Pesanan yang Perlu Ditugaskan</h3>
            <p className="text-gray-500">Semua pesanan sudah ditugaskan atau belum ada yang disetujui</p>
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
                    <p className="text-gray-600">#{order.id} - {order.user.name}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Alamat Penjemputan</p>
                    <p className="text-gray-800">{order.pickup_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Harga</p>
                    <p className="text-xl font-bold text-green-600">
                      Rp {Number(order.total_price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {selectedOrder === order.id ? (
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
                      Tugaskan Petugas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignPetugas