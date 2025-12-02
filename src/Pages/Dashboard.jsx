import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Dashboard EcoCare</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-semibold text-gray-800 mb-2">Laporan Sampah</h3>
            <p className="text-gray-600">Laporkan sampah di sekitar Anda</p>
          </Link>
          
          <Link to="/recycling" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Daur Ulang</h3>
            <p className="text-gray-600">Jual sampah daur ulang Anda</p>
          </Link>
          
          <Link to="/pickup" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="font-semibold text-gray-800 mb-2">Pengangkutan</h3>
            <p className="text-gray-600">Pesan jasa pengangkutan sampah</p>
          </Link>
          
          <Link to="/education" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Edukasi</h3>
            <p className="text-gray-600">Pelajari pengelolaan sampah</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard