import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from '../../contexts/LanguageContext'

function ManageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [selectedReport, setSelectedReport] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [feeAmount, setFeeAmount] = useState("")
  const [petugasList, setPetugasList] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPetugas, setSelectedPetugas] = useState("")
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reportToDelete, setReportToDelete] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reportToReject, setReportToReject] = useState(null)

  useEffect(() => {
    fetchReports()
    fetchPetugas()
  }, [])

  const fetchReports = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/reports", {
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

  const fetchPetugas = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      const petugas = data.filter(user => user.roles?.[0]?.slug === 'petugas')
      setPetugasList(petugas)
    } catch (error) {
      console.error(error)
    }
  }

  const handleVerify = async (id, status, notes = null) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const body = { status }
      if (notes) body.admin_notes = notes
      
      const response = await fetch(`http://127.0.0.1:8000/api/admin/reports/${id}/verify`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (data.status) {
        alert(t('status_updated'))
        setShowModal(false)
        setAdminNotes("")
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert(t('update_status_failed'))
    }
  }

  const handleRevision = async (id, notes) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const body = { status: "pending", admin_notes: notes }
      
      const response = await fetch(`http://127.0.0.1:8000/api/admin/reports/${id}/verify`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (data.status) {
        alert(t('revision_sent'))
        setShowModal(false)
        setAdminNotes("")
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert(t('send_revision_failed'))
    }
  }

  const handleAssignPetugas = async () => {
    if (!selectedPetugas) {
      alert(t('select_officer_first'))
      return
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/reports/${selectedReport.id}/assign-petugas`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petugas_id: selectedPetugas }),
      })
      const data = await response.json()
      if (data.status) {
        alert(t('officer_assigned'))
        setShowAssignModal(false)
        setSelectedPetugas("")
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert(t('assign_officer_failed'))
    }
  }

  const openNotesModal = (report) => {
    setSelectedReport(report)
    setAdminNotes(report.admin_notes || "")
    setShowModal(true)
  }

  const openAssignModal = (report) => {
    setSelectedReport(report)
    setSelectedPetugas(report.assigned_petugas_id || "")
    setShowAssignModal(true)
  }

  const openPhotoModal = (photoUrl, reportTitle) => {
    setSelectedPhoto({ url: photoUrl, title: reportTitle })
    setShowPhotoModal(true)
  }

  const openDeleteModal = (report) => {
    setReportToDelete(report)
    setShowDeleteModal(true)
  }

  const openRejectModal = (report) => {
    setReportToReject(report)
    setShowRejectModal(true)
  }

  const handleRejectReport = async () => {
    try {
      await handleVerify(reportToReject.id, "rejected")
      setShowRejectModal(false)
      setReportToReject(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteReport = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/reports/${reportToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        alert(t('report_deleted'))
        setShowDeleteModal(false)
        setReportToDelete(null)
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert(t('delete_failed'))
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return badges[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) return <div className="p-6">{t('loading')}</div>

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{t('back')}</span>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{t('manage_reports_title')}</h1>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(report.status)} ml-2`}>
                  {report.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">📍 {t('location')}:</span>
                  <p className="font-medium">{report.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">👤 {t('reporter')}:</span>
                  <p className="font-medium">{report.user?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">👷 {t('assigned_officer')}:</span>
                  <p className="font-medium">{report.assigned_petugas ? report.assigned_petugas.name : '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">💰 {t('fee')}:</span>
                  <p className="font-medium">{report.fee_amount ? `Rp ${Number(report.fee_amount).toLocaleString()}` : '-'}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {report.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleVerify(report.id, "verified")}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                    >
                      {t('verify')}
                    </button>
                    <button
                      onClick={() => openNotesModal(report)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
                    >
                      {t('revision')}
                    </button>
                    <button
                      onClick={() => openRejectModal(report)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                    >
                      {t('reject')}
                    </button>
                  </>
                )}
                {report.status === "verified" && (
                  <button
                    onClick={() => openAssignModal(report)}
                    className="flex-1 bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600"
                  >
                    {t('assign_officer')}
                  </button>
                )}
                {report.photo && (
                  <button
                    onClick={() => openPhotoModal(`http://127.0.0.1:8000/storage/${report.photo}`, report.title)}
                    className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
                  >
                    📷 {t('photo')}
                  </button>
                )}
                <button
                  onClick={() => openDeleteModal(report)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                >
                  🗑️ {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('report_title')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('location')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('reporter')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('assigned_officer')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('fee')}</th>
                  <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-3 xl:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{report.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{report.description}</div>
                    </td>
                    <td className="px-3 xl:px-6 py-4 text-sm text-gray-500">{report.location}</td>
                    <td className="px-3 xl:px-6 py-4 text-sm text-gray-500">{report.user?.name}</td>
                    <td className="px-3 xl:px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-3 xl:px-6 py-4 text-sm text-gray-500">
                      {report.assigned_petugas ? report.assigned_petugas.name : '-'}
                    </td>
                    <td className="px-3 xl:px-6 py-4 text-sm text-gray-500">
                      {report.fee_amount ? `Rp ${Number(report.fee_amount).toLocaleString()}` : '-'}
                    </td>
                    <td className="px-3 xl:px-6 py-4 text-sm">
                      <div className="flex flex-col space-y-1">
                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleVerify(report.id, "verified")}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              {t('verify')}
                            </button>
                            <button
                              onClick={() => openNotesModal(report)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                            >
                              {t('revision')}
                            </button>
                            <button
                              onClick={() => openRejectModal(report)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            >
                              {t('reject')}
                            </button>
                          </>
                        )}
                        {report.status === "verified" && (
                          <button
                            onClick={() => openAssignModal(report)}
                            className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                          >
                            {t('assign')}
                          </button>
                        )}
                        {report.photo && (
                          <button
                            onClick={() => openPhotoModal(`http://127.0.0.1:8000/storage/${report.photo}`, report.title)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            📷 {t('photo')}
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(report)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                        >
                          🗑️ {t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Modal untuk catatan revisi */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 max-w-md w-full border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4">{t('verify_report_modal')}</h2>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder={t('write_notes_placeholder')}
            className="w-full border rounded p-2 min-h-[100px] mb-4"
          />
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              💡 {t('fee_info')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleVerify(selectedReport.id, "verified", adminNotes)}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {t('verify_button')}
            </button>
            <button
              onClick={() => handleRevision(selectedReport.id, adminNotes)}
              className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            >
              {t('send_revision')}
            </button>
            <button
              onClick={() => {
                setShowModal(false)
                setAdminNotes("")
              }}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal untuk assign petugas */}
    {showAssignModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 max-w-md w-full border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4">{t('assign_officer_modal')}</h2>
          <select
            value={selectedPetugas}
            onChange={(e) => setSelectedPetugas(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">{t('select_officer')}</option>
            {petugasList.map((petugas) => (
              <option key={petugas.id} value={petugas.id}>
                {petugas.name} - {petugas.email}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleAssignPetugas}
              className="flex-1 bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              {t('assign')}
            </button>
            <button
              onClick={() => {
                setShowAssignModal(false)
                setSelectedPetugas("")
              }}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal untuk lihat foto */}
    {showPhotoModal && selectedPhoto && (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              📷 {t('photo_report')}: {selectedPhoto.title}
            </h3>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Photo */}
          <div className="p-4">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 text-center">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal konfirmasi hapus */}
    {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full border-2 border-red-200">
          <div className="text-center">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('delete_report_confirm')}</h2>
            <p className="text-gray-600 mb-2">
              <strong>{reportToDelete?.title}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('delete_warning')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setReportToDelete(null)
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteReport}
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('reject_report_confirm')}</h2>
            <p className="text-gray-600 mb-2">
              <strong>{reportToReject?.title}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('reject_warning')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setReportToReject(null)
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleRejectReport}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                {t('reject')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default ManageReports
