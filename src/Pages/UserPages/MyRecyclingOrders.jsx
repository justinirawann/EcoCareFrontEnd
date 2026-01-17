import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

function MyRecyclingOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    
    try {
      const response = await fetch("https://ecocare-api.up.railway.app/api/recycling/my-orders", {
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
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return t('status_pending')
      case 'Approved': return t('status_approved')
      case 'Berjalan': return t('status_ongoing')
      case 'Selesai': return t('status_finished')
      case 'Ditolak': return t('status_rejected')
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading_orders')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">{t('my_recycling_orders_title')}</h1>
          <Link
            to="/dashboard/create-recycling"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            + {t('create_new_order')}
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('no_orders_yet')}</h3>
            <p className="text-gray-500 mb-6">{t('no_orders_desc')}</p>
            <Link
              to="/dashboard/create-recycling"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('create_first_order')}
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
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {order.image && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{t('waste_photo_label')}</p>
                      <img
                        src={`https://ecocare-api.up.railway.app/storage/${order.image}`}
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
                    <p className="text-sm text-gray-500">{t('pickup_address_label')}</p>
                    <p className="text-gray-800">{order.pickup_address}</p>
                  </div>
                </div>

                {order.price_per_kg && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">{t('price_per_kg')}</p>
                        <p className="text-lg font-semibold text-green-600">
                          Rp {Number(order.price_per_kg).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('weight')}</p>
                        <p className="text-lg font-semibold">{order.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('total_price')}</p>
                        <p className="text-xl font-bold text-green-600">
                          Rp {Number(order.total_price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {order.petugas && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-500">{t('assigned_officer')}</p>
                    <p className="font-semibold text-blue-800">{order.petugas.name}</p>
                  </div>
                )}

                {order.admin_notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{t('admin_notes_label')}</p>
                    <p className="text-gray-800">{order.admin_notes}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  {t('created_date')} {new Date(order.created_at).toLocaleDateString('id-ID')}
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
            ← {t('back_to_dashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyRecyclingOrders