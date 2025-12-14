import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../../api/api"
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [pendingReports, setPendingReports] = useState(0)
  const [pendingRecycling, setPendingRecycling] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null")
    setUser(savedUser)
    fetchPendingCounts()
  }, [])

  const fetchPendingCounts = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      // Fetch pending reports
      const reportsResponse = await fetch('http://127.0.0.1:8000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        const pending = reportsData.data.filter(report => report.status === 'pending').length
        setPendingReports(pending)
      }

      // Fetch pending recycling orders
      const recyclingResponse = await fetch('http://127.0.0.1:8000/api/admin/recycling', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (recyclingResponse.ok) {
        const recyclingData = await recyclingResponse.json()
        const pending = recyclingData.data.filter(order => order.status === 'pending').length
        setPendingRecycling(pending)
      }
    } catch (error) {
      console.error('Error fetching pending counts:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/ecocarelogo.png" alt="EcoCare Logo" className="w-6 h-6" />
              <h1 className="text-2xl font-bold text-red-700 font-impact">{t('admin_dashboard_title')}</h1>
            </div>
            <LanguageSwitcher />
          </div>
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-2 transition-colors"
              >
                <img
                  src={user?.image ? `http://127.0.0.1:8000/storage/${user.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=dc2626&color=fff&size=40`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-300 shadow-sm"
                />
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <Link
                    to="/admin/edit-profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('edit_profile')}
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('admin_dashboard')} 🏛️</h2>
              <p className="text-red-100">{t('manage_ecocare_system')}</p>
            </div>
            <div className="text-right">
              <p className="text-red-100 text-sm">{t('hello_user')}, {user?.name}! 👋</p>
              <p className="text-red-200 text-xs">{t('administrator_ecocare')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div 
            onClick={() => navigate("/admin/reports")}
            className="p-6 border rounded-xl bg-green-100 cursor-pointer hover:bg-green-200 transition relative"
          >
            {pendingReports > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {pendingReports}
              </div>
            )}
            <h3 className="text-lg font-semibold text-green-700">📝 {t('verify_reports')}</h3>
            <p className="text-gray-700 mt-1">
              {t('verify_reports_desc')}
            </p>
          </div>

          <div 
            onClick={() => navigate("/admin/recycling")}
            className="p-6 border rounded-xl bg-blue-100 cursor-pointer hover:bg-blue-200 transition relative"
          >
            {pendingRecycling > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {pendingRecycling}
              </div>
            )}
            <h3 className="text-lg font-semibold text-blue-700">♻️ {t('manage_recycling')}</h3>
            <p className="text-gray-700 mt-1">
              {t('manage_recycling_desc')}
            </p>
          </div>





          <div 
            onClick={() => navigate("/admin/articles")}
            className="p-6 border rounded-xl bg-red-100 cursor-pointer hover:bg-red-200 transition"
          >
            <h3 className="text-lg font-semibold text-red-700">📰 {t('manage_articles')}</h3>
            <p className="text-gray-700 mt-1">
              {t('manage_articles_desc')}
            </p>
          </div>

          <div 
            onClick={() => navigate("/admin/users")}
            className="p-6 border rounded-xl bg-indigo-100 cursor-pointer hover:bg-indigo-200 transition"
          >
            <h3 className="text-lg font-semibold text-indigo-700">👥 {t('user_management')}</h3>
            <p className="text-gray-700 mt-1">
              {t('user_management_desc')}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
