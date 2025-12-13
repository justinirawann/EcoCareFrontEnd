import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function ManageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [selectedReport, setSelectedReport] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [feeAmount, setFeeAmount] = useState("")
  const [petugasList, setPetugasList] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPetugas, setSelectedPetugas] = useState("")
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

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
        alert("Status berhasil diupdate!")
        setShowModal(false)
        setAdminNotes("")
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert("Gagal update status")
    }
  }

  const handleAssignPetugas = async () => {
    if (!selectedPetugas) {
      alert("Pilih petugas terlebih dahulu")
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
        alert("Petugas berhasil ditugaskan!")
        setShowAssignModal(false)
        setSelectedPetugas("")
        fetchReports()
      }
    } catch (error) {
      console.error(error)
      alert("Gagal assign petugas")
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return badges[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Laporan</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelapor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Petugas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.user?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {report.assigned_petugas ? report.assigned_petugas.name : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {report.fee_amount ? `Rp ${Number(report.fee_amount).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(report.id, "verified")}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Verifikasi
                        </button>
                        <button
                          onClick={() => openNotesModal(report)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Revisi
                        </button>
                        <button
                          onClick={() => handleVerify(report.id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    {report.status === "verified" && (
                      <button
                        onClick={() => openAssignModal(report)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                      >
                        Assign Petugas
                      </button>
                    )}
                    {report.photo && (
                      <button
                        onClick={() => openPhotoModal(`http://127.0.0.1:8000/storage/${report.photo}`, report.title)}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        📷 Lihat Foto
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Modal untuk catatan revisi */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4">Verifikasi Laporan</h2>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Tulis catatan untuk user..."
            className="w-full border rounded p-2 min-h-[100px] mb-4"
          />
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              💡 Biaya akan ditentukan oleh petugas setelah konsultasi langsung dengan user
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleVerify(selectedReport.id, "verified", adminNotes)}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Verifikasi
            </button>
            <button
              onClick={() => {
                setShowModal(false)
                setAdminNotes("")
              }}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal untuk assign petugas */}
    {showAssignModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4">Assign Petugas</h2>
          <select
            value={selectedPetugas}
            onChange={(e) => setSelectedPetugas(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          >
            <option value="">Pilih Petugas</option>
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
              Assign
            </button>
            <button
              onClick={() => {
                setShowAssignModal(false)
                setSelectedPetugas("")
              }}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Batal
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
              📷 Foto Laporan: {selectedPhoto.title}
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
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default ManageReports
