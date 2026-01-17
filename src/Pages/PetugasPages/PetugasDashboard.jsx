import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PetugasProfileCheck from "../../middleware/PetugasProfileCheck"
import { useLanguage } from '../../contexts/LanguageContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'

function PetugasDashboard() {
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
      const reportsResponse = await fetch('https://ecocare-api.up.railway.app/api/petugas/report-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json()
        const pending = reportsData.data.filter(report => report.status !== 'completed').length
        setPendingReports(pending)
      }

      // Fetch pending recycling tasks
      const recyclingResponse = await fetch('https://ecocare-api.up.railway.app/api/petugas/recycling-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (recyclingResponse.ok) {
        const recyclingData = await recyclingResponse.json()
        const pending = recyclingData.tasks.filter(task => task.status !== 'Selesai').length
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
    <PetugasProfileCheck>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
              <img src="/ecocarelogo.png" alt="EcoCare Logo" className="w-6 h-6" />
              <h1 className="text-2xl font-bold text-blue-700 font-impact">{t('petugas_dashboard_title')}</h1>
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
                    src={user?.image ? `https://ecocare-api.up.railway.app/storage/${user.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1d4ed8&color=fff&size=40`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 shadow-sm"
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
                      to="/petugas/edit-profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('petugas_dashboard')} 👷</h2>
                <p className="text-blue-100">{t('manage_waste_transport')}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">{t('hello_user')}, {user?.name}! 👋</p>
                <p className="text-blue-200 text-xs">{t('field_officer_ecocare')}</p>
              </div>
            </div>
          </div>

          {/* Main Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('main_tasks')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                to="/petugas/report-tasks"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 relative"
              >
                {pendingReports > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {pendingReports}
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-5xl">📋</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('report_tasks')}</h3>
                    <p className="text-gray-600 text-sm">{t('report_tasks_desc')}</p>
                    <span className="inline-block mt-3 text-blue-600 font-semibold text-sm">→ {t('view_tasks')}</span>
                  </div>
                </div>
              </Link>
              
              <Link 
                to="/petugas/recycling-tasks"
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500 relative"
              >
                {pendingRecycling > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {pendingRecycling}
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="text-5xl">♻️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t('recycling_tasks')}</h3>
                    <p className="text-gray-600 text-sm">{t('recycling_tasks_desc')}</p>
                    <span className="inline-block mt-3 text-green-600 font-semibold text-sm">→ {t('view_tasks')}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">💡 {t('officer_info')}</h4>
            <p className="text-blue-800 text-sm">{t('update_report_status_tip')}</p>
          </div>
        </div>
      </div>
    </PetugasProfileCheck>
  )
}

export default PetugasDashboard
