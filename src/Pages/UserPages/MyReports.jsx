import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from '../../contexts/LanguageContext'

function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    fetchMyReports()
  }, [])

  const fetchMyReports = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reports/my-reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.status) {
        setReports(data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: t('status_pending') },
      verified: { bg: "bg-blue-100", text: "text-blue-800", label: t('status_verified') },
      completed: { bg: "bg-green-100", text: "text-green-800", label: t('status_completed') },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: t('status_rejected') },
    }
    return badges[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status }
  }

  if (loading) return <div className="min-h-screen bg-green-50 p-6">{t('loading')}...</div>

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">{t('my_reports_title')}</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {t('back')}
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">{t('no_reports_yet')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => {
              const statusInfo = getStatusBadge(report.status)
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">{report.title}</h2>
                      <p className="text-gray-600 mt-1">{report.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">📍 {t('location_label')}</span>
                      <p className="font-medium">{report.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">📅 {t('date_label')}</span>
                      <p className="font-medium">{new Date(report.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>

                  {report.admin_notes && (
                    <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-yellow-800 mb-1">💬 {t('admin_notes')}</p>
                          <p className="text-sm text-yellow-700">{report.admin_notes}</p>
                        </div>
                        {report.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/dashboard/edit-report/${report.id}`)}
                            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-semibold"
                          >
                            {t('edit_report')}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {report.photo && (
                    <div className="mt-4">
                      <img
                        src={`http://127.0.0.1:8000/storage/${report.photo}`}
                        alt={report.title}
                        className="w-full max-w-md rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReports
