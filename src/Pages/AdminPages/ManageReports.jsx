import { useState, useEffect } from "react"

function ManageReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchReports()
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

  const openNotesModal = (report) => {
    setSelectedReport(report)
    setAdminNotes(report.admin_notes || "")
    setShowModal(true)
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Laporan</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelapor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                        onClick={() => handleVerify(report.id, "completed")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Selesai
                      </button>
                    )}
                    {report.photo && (
                      <a
                        href={`http://127.0.0.1:8000/storage/${report.photo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Lihat Foto
                      </a>
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
          <h2 className="text-xl font-bold mb-4">Catatan Revisi</h2>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Tulis catatan revisi untuk user..."
            className="w-full border rounded p-2 min-h-[100px] mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleVerify(selectedReport.id, "pending", adminNotes)}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Kirim Revisi
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
    </>
  )
}

export default ManageReports
