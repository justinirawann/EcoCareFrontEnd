import { Link } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      
      {/* NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">🌱</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                EcoCare
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Fitur
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Cara Kerja
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Tentang
              </a>
              <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Fitur
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Cara Kerja
                </a>
                <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  Tentang
                </a>
                <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center"
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🌍</span>
              Mendukung SDG 12: Konsumsi & Produksi Berkelanjutan
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Solusi <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Cerdas</span><br />
              Pengelolaan Sampah
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Platform digital yang menghubungkan masyarakat, petugas, dan admin untuk pengelolaan sampah yang efektif, transparan, dan berkelanjutan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🚀 Mulai Sekarang - Gratis!
              </Link>
              <Link
                to="/login"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-gray-600 text-sm">Gratis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600 text-sm">Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">Real-time</div>
              <div className="text-gray-600 text-sm">Tracking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">Mudah</div>
              <div className="text-gray-600 text-sm">Digunakan</div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Semua Pengguna
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terintegrasi dengan fitur khusus untuk masyarakat, petugas, dan admin
            </p>
          </div>

          {/* User Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-green-700 mb-8">👥 Untuk Masyarakat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Buat Laporan Sampah</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Laporkan sampah dengan foto, lokasi, dan deskripsi. Sistem akan memverifikasi dan menugaskan petugas.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">♻️</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Order Daur Ulang</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pesan jasa pengangkutan sampah daur ulang dengan sistem penjadwalan yang fleksibel.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Tracking Real-time</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pantau status laporan dan order dari pending hingga selesai dengan notifikasi otomatis.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">✏️</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Edit & Revisi</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Edit laporan berdasarkan feedback admin dan revisi data sesuai kebutuhan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Artikel Edukasi</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Akses artikel edukatif tentang pengelolaan sampah dan lingkungan hidup.
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">👤</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Profil Lengkap</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kelola profil pribadi dengan data lengkap untuk layanan yang lebih baik.
                </p>
              </div>
            </div>
          </div>

          {/* Petugas Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-blue-700 mb-8">👷 Untuk Petugas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📋</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Kelola Tugas Laporan</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dashboard khusus untuk mengelola laporan yang ditugaskan dengan sistem negosiasi biaya.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🚛</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Tugas Daur Ulang</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kelola order daur ulang dengan jadwal pickup dan sistem pembayaran terintegrasi.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">Manajemen Pembayaran</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Atur biaya layanan dan kelola status pembayaran dengan sistem yang transparan.
                </p>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja EcoCare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proses sederhana dalam 4 langkah untuk pengelolaan sampah yang efektif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Daftar & Login</h3>
              <p className="text-gray-600 text-sm">
                Buat akun gratis dan lengkapi profil Anda untuk mulai menggunakan layanan.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Buat Laporan/Order</h3>
              <p className="text-gray-600 text-sm">
                Laporkan sampah atau pesan jasa daur ulang dengan foto dan detail lokasi.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verifikasi & Assign</h3>
              <p className="text-gray-600 text-sm">
                Admin memverifikasi dan menugaskan petugas terbaik untuk menangani permintaan Anda.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Selesai & Bayar</h3>
              <p className="text-gray-600 text-sm">
                Petugas menyelesaikan tugas, Anda melakukan pembayaran, dan memberikan feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & SDG SECTION */}
      <section id="about" className="py-16 sm:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Mendukung SDG 12
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                EcoCare mendukung <strong>SDG 12: Responsible Consumption and Production</strong> 
                dengan membangun ekosistem digital yang menghubungkan masyarakat, petugas, dan pemerintah 
                untuk pengelolaan sampah yang bertanggung jawab dan berkelanjutan.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🌱</div>
                  <span>Mengurangi limbah dan meningkatkan daur ulang</span>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤝</div>
                  <span>Membangun komunitas peduli lingkungan</span>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📱</div>
                  <span>Teknologi untuk solusi lingkungan</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
                <p className="text-lg">
                  Menjadi platform terdepan dalam digitalisasi pengelolaan sampah 
                  untuk menciptakan lingkungan yang bersih dan berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Siap Berkontribusi untuk Lingkungan?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan pengelolaan sampah dengan EcoCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🌟 Daftar Sekarang - Gratis!
            </Link>
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              Sudah punya akun? Masuk di sini →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🌱</div>
                <h4 className="text-xl font-bold">EcoCare</h4>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Platform digital terdepan untuk pengelolaan sampah berbasis masyarakat. 
                Bersama-sama kita ciptakan lingkungan yang bersih dan berkelanjutan.
              </p>
              <div className="flex space-x-4">
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</div>
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</div>
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">🌐</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Fitur Utama</h5>
              <ul className="space-y-2 text-gray-300">
                <li>• Laporan Sampah</li>
                <li>• Order Daur Ulang</li>
                <li>• Tracking Real-time</li>
                <li>• Artikel Edukasi</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Untuk Semua</h5>
              <ul className="space-y-2 text-gray-300">
                <li>• Masyarakat</li>
                <li>• Petugas Lapangan</li>
                <li>• Komunitas Peduli Lingkungan</li>
                <li>• Pemerintah Daerah</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} EcoCare. Semua hak dilindungi. 
              <span className="mx-2">•</span>
              Mendukung SDG 12: Konsumsi & Produksi Berkelanjutan
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
