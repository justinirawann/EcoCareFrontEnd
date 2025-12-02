import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">EcoCare</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* TEXT */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight mb-6">
              Solusi Cerdas Pengelolaan Sampah <br /> untuk Lingkungan Lebih Bersih
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              EcoCare membantu masyarakat melaporkan sampah, memesan jasa
              pengangkutan, dan memantau proses pengelolaan sampah secara mudah,
              cepat, dan transparan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Mulai Sekarang
              </Link>
              <Link
                to="/login"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* IMAGE / ILLUSTRATION */}
          <div className="flex justify-center">
            <img
              src="/ecocare.jpg"
              alt="EcoCare Hero"
              className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* FITUR SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-green-800 mb-14">
            Fitur Unggulan EcoCare
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
              <div className="text-5xl mb-4">📍</div>
              <h4 className="font-bold text-lg mb-2">Laporan Sampah</h4>
              <p className="text-gray-600 text-sm">
                Laporkan lokasi sampah di lingkungan sekitar secara realtime.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
              <div className="text-5xl mb-4">🚛</div>
              <h4 className="font-bold text-lg mb-2">Jasa Angkut</h4>
              <p className="text-gray-600 text-sm">
                Pesan pengangkutan sampah langsung dari aplikasi.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
              <div className="text-5xl mb-4">💳</div>
              <h4 className="font-bold text-lg mb-2">Pembayaran Online</h4>
              <p className="text-gray-600 text-sm">
                Sistem pembayaran mudah dan terverifikasi admin.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="font-bold text-lg mb-2">Tracking Status</h4>
              <p className="text-gray-600 text-sm">
                Pantau status laporan dan pengangkutan secara otomatis.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SDG SECTION */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">
            Mendukung SDG 12
          </h3>
          <p className="text-lg leading-relaxed">
            EcoCare mendukung <strong>SDG 12: Responsible Consumption and
            Production</strong> dengan membantu masyarakat mengelola sampah secara
            bertanggung jawab dan berkelanjutan.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-xl font-bold mb-2">EcoCare</h4>
          <p className="text-sm text-green-200 mb-4">
            Solusi Digital Pengelolaan Sampah Berbasis Masyarakat
          </p>
          <p className="text-xs text-green-300">
            © {new Date().getFullYear()} EcoCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
