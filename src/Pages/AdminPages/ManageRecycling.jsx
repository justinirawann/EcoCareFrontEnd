import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

function ManageRecycling() {
  const [orders, setOrders] = useState([])
  const [petugas, setPetugas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedAssign, setSelectedAssign] = useState(null)
  const [selectedPetugas, setSelectedPetugas] = useState('')
  const [priceData, setPriceData] = useState({ price_per_kg: '', admin_notes: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [orderToReject, setOrderToReject] = useState(null)

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
        alert(t('order_approved'))
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
        alert(t('order_rejected'))
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
        alert(t('officer_assigned'))
        setSelectedAssign(null)
        setSelectedPetugas('')
        fetchOrders()
      }
    } catch (error) {
      console.error("Error assigning petugas:", error)
    }
  }

  const openDeleteModal = (order) => {
    setOrderToDelete(order)
    setShowDeleteModal(true)
  }

  const openRejectModal = (order) => {
    setOrderToReject(order)
    setShowRejectModal(true)
  }

  const handleRejectOrder = async () => {
    try {
      await handleReject(orderToReject.id)
      setShowRejectModal(false)
      setOrderToReject(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteOrder = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/recycling/${orderToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        alert(t('order_deleted'))
        setShowDeleteModal(false)
        setOrderToDelete(null)
        fetchOrders()
      }
    } catch (error) {
      console.error(error)
      alert(t('delete_failed'))
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
          <p className="text-gray-600">{t('loading_orders')}</p>
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
            {t('back')}
          </button>
          <h1 className="text-3xl font-bold text-blue-700">{t('manage_recycling_title')}</h1>
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
                    <p className="text-sm text-gray-500 mb-2">{t('waste_photo')}</p>
                    <img
                      src={`http://127.0.0.1:8000/storage/${order.image}`}
                      alt="Sampah"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">{t('description')}</p>
                  <p className="text-gray-800">{order.description || t('no_description')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('pickup_address')}</p>
                  <p className="text-gray-800">{order.pickup_address}</p>
                </div>
              </div>

              {order.status === 'Pending' && (
                <div className="border-t pt-4">
                  {selectedOrder === order.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('price_per_kg_label')}
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-lg"
                          value={priceData.price_per_kg}
                          onChange={(e) => setPriceData({...priceData, price_per_kg: e.target.value})}
                          placeholder={t('price_per_kg_placeholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin_notes')}
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg"
                          value={priceData.admin_notes}
                          onChange={(e) => setPriceData({...priceData, admin_notes: e.target.value})}
                          placeholder={t('admin_notes_placeholder')}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          {t('approve')}
                        </button>
                        <button
                          onClick={() => openRejectModal(order)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          {t('reject')}
                        </button>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t('review_order')}
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
                          {t('select_officer_label')}
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg"
                          value={selectedPetugas}
                          onChange={(e) => setSelectedPetugas(e.target.value)}
                        >
                          <option value="">{t('select_officer_placeholder')}</option>
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
                          {t('assign_task')}
                        </button>
                        <button
                          onClick={() => setSelectedAssign(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssign(order.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      {t('assign_officer_button')}
                    </button>
                  )}
                </div>
              )}

              {order.price_per_kg && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">{t('price_per_kg')}</p>
                      <p className="font-semibold text-green-600">Rp {Number(order.price_per_kg).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('total_price')}</p>
                      <p className="font-bold text-green-600">Rp {Number(order.total_price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('status')}</p>
                      <p className="font-semibold">{order.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {order.petugas && (
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500">{t('assigned_officer_label')}</p>
                  <p className="font-semibold text-blue-800">{order.petugas.name}</p>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <button
                  onClick={() => openDeleteModal(order)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  🗑️ {t('delete_order')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal konfirmasi hapus */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full border-2 border-red-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('delete_order_confirm')}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>{orderToDelete?.category} - {orderToDelete?.weight} kg</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('delete_warning')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setOrderToDelete(null)
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal konfirmasi reject */}
        {showRejectModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full border-2 border-red-200">
              <div className="text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('reject_order_confirm')}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>{orderToReject?.category} - {orderToReject?.weight} kg</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('reject_warning')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(false)
                      setOrderToReject(null)
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleRejectOrder}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    {t('reject')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageRecycling