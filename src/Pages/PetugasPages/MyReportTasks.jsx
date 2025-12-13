import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyReportTasks() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feeAmount, setFeeAmount] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/petugas/report-tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');

      const data = await response.json();
      setReports(data.data);
      setError('');
    } catch (err) {
      setError('Gagal memuat tugas laporan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/petugas/reports/${reportId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_status: status }),
      });

      if (!response.ok) throw new Error('Failed to update payment');

      setSuccess(`Status pembayaran berhasil diubah ke ${status === 'paid' ? 'Lunas' : 'Belum Bayar'}`);
      fetchReports();
    } catch (err) {
      setError('Gagal update status pembayaran');
      console.error(err);
    }
  };

  const openFeeModal = (report) => {
    setSelectedReport(report);
    setFeeAmount(report.fee_amount || '');
    setShowFeeModal(true);
  };

  const updateFee = async () => {
    if (!feeAmount || feeAmount <= 0) {
      setError('Masukkan biaya yang valid');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/petugas/reports/${selectedReport.id}/fee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fee_amount: feeAmount }),
      });

      if (!response.ok) throw new Error('Failed to update fee');

      setSuccess('Biaya berhasil diupdate');
      setShowFeeModal(false);
      setFeeAmount('');
      fetchReports();
    } catch (err) {
      setError('Gagal update biaya');
      console.error(err);
    }
  };

  const openCompleteModal = (report) => {
    setSelectedReport(report);
    setShowCompleteModal(true);
  };

  const completeReport = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/petugas/reports/${selectedReport.id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Gagal menyelesaikan laporan');
        return;
      }

      setSuccess('Laporan berhasil diselesaikan');
      setShowCompleteModal(false);
      fetchReports();
    } catch (err) {
      setError('Gagal menyelesaikan laporan');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/petugas/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-800">📋 Tugas Laporan Saya</h1>
          </div>
          <p className="text-gray-600 mt-2">Kelola laporan yang ditugaskan kepada Anda</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {reports.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">Belum ada tugas laporan yang ditugaskan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laporan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-500">{report.location}</div>
                            {report.photo && (
                              <img
                                src={`http://127.0.0.1:8000/storage/${report.photo}`}
                                alt="Report"
                                className="w-16 h-16 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{report.user?.name}</div>
                          <div className="text-sm text-gray-500">{report.user?.phone}</div>
                          <div className="text-sm text-gray-500">{report.user?.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.status === 'completed' ? 'bg-green-100 text-green-800' :
                            report.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.fee_amount ? (
                            <span className="text-green-600 font-semibold">
                              Rp {Number(report.fee_amount).toLocaleString()}
                            </span>
                          ) : (
                            <button
                              onClick={() => openFeeModal(report)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Set Biaya
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {report.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {report.status !== 'completed' && (
                            <>
                              {report.fee_amount && (
                                <button
                                  onClick={() => openFeeModal(report)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit Biaya
                                </button>
                              )}
                              {report.fee_amount && report.payment_status === 'unpaid' ? (
                                <button
                                  onClick={() => updatePaymentStatus(report.id, 'paid')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Tandai Lunas
                                </button>
                              ) : report.fee_amount && report.payment_status === 'paid' ? (
                                <button
                                  onClick={() => updatePaymentStatus(report.id, 'unpaid')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Tandai Belum Bayar
                                </button>
                              ) : null}
                              {report.fee_amount && report.payment_status === 'paid' && (
                                <button
                                  onClick={() => openCompleteModal(report)}
                                  className="text-purple-600 hover:text-purple-900 font-semibold"
                                >
                                  Selesaikan
                                </button>
                              )}
                            </>
                          )}
                          {report.status === 'completed' && (
                            <span className="text-green-600 font-semibold">✓ Selesai</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal untuk set/edit biaya */}
        {showFeeModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedReport?.fee_amount ? 'Edit Biaya' : 'Set Biaya Negosiasi'}
                </h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Laporan: <strong>{selectedReport?.title}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    User: <strong>{selectedReport?.user?.name}</strong>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Setelah Negosiasi (Rp)
                  </label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    placeholder="Masukkan biaya hasil negosiasi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-blue-700">
                    💡 Konsultasikan dengan user di lokasi untuk menentukan biaya yang sesuai
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowFeeModal(false);
                      setFeeAmount('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={updateFee}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Simpan Biaya
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal untuk konfirmasi selesaikan laporan */}
        {showCompleteModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border-2 border-green-200">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Selesaikan Laporan?
                </h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    <strong>{selectedReport?.title}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    User: {selectedReport?.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Biaya: Rp {selectedReport?.fee_amount ? Number(selectedReport.fee_amount).toLocaleString() : 0}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-green-700">
                    🎉 Pastikan semua pekerjaan sudah selesai dan user sudah puas dengan hasilnya!
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCompleteModal(false)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={completeReport}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    Ya, Selesaikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}