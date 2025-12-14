import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      
      {/* NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/ecocarelogo.png" alt="EcoCare Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold font-impact bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                EcoCare
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('features')}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('how_it_works')}
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                {t('about')}
              </a>
              <LanguageSwitcher />
              <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('register_free')}
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
                  {t('features')}
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  {t('how_it_works')}
                </a>
                <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                  {t('about')}
                </a>
                <div className="py-2">
                  <LanguageSwitcher />
                </div>
                <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center"
                >
                  {t('register_free')}
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
              {t('sdg_support')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {t('hero_title_solution')} <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t('hero_title_smart')}</span><br />
              {t('hero_title_waste')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('start_now_free')}
              </Link>
              <Link
                to="/login"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300"
              >
                {t('login_account')}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-gray-600 text-sm">{t('stat_free')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600 text-sm">{t('stat_available')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{t('stat_realtime')}</div>
              <div className="text-gray-600 text-sm">{t('stat_tracking')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{t('stat_easy')}</div>
              <div className="text-gray-600 text-sm">{t('stat_to_use')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR SECTION */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('complete_features')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('integrated_platform')}
            </p>
          </div>

          {/* User Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-green-700 mb-8">{t('for_community')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('create_report')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('create_report_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">♻️</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('recycling_order')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('recycling_order_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('realtime_tracking')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('realtime_tracking_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">✏️</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('edit_revise')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('edit_revise_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📚</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('educational_articles')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('educational_articles_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">👤</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('complete_profile')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('complete_profile_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Petugas Features */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-blue-700 mb-8">{t('for_officers')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">📋</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('manage_report_tasks')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('manage_report_tasks_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">🚛</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('recycling_tasks')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('recycling_tasks_desc')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="font-bold text-lg mb-3 text-gray-800">{t('payment_management')}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('payment_management_desc')}
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
              {t('how_ecocare_works')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('simple_process')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step_register')}</h3>
              <p className="text-gray-600 text-sm">
                {t('step_register_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step_create')}</h3>
              <p className="text-gray-600 text-sm">
                {t('step_create_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step_verify')}</h3>
              <p className="text-gray-600 text-sm">
                {t('step_verify_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('step_complete')}</h3>
              <p className="text-gray-600 text-sm">
                {t('step_complete_desc')}
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
                {t('supporting_sdg12')}
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                {t('sdg_description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🌱</div>
                  <span>{t('reduce_waste')}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤝</div>
                  <span>{t('build_community')}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">📱</div>
                  <span>{t('tech_solution')}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">{t('our_vision')}</h3>
                <p className="text-lg">
                  {t('vision_desc')}
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
            {t('ready_contribute')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('join_thousands')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('register_now_star')}
            </Link>
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              {t('have_account')}
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
                <img src="/ecocarelogo.png" alt="EcoCare Logo" className="w-6 h-6" />
                <h4 className="text-xl font-bold font-impact">EcoCare</h4>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                {t('footer_description')}
              </p>
              <div className="flex space-x-4">
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</div>
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</div>
                <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">🌐</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t('main_features')}</h5>
              <ul className="space-y-2 text-gray-300">
                <li>{t('waste_reports')}</li>
                <li>{t('recycling_orders')}</li>
                <li>{t('realtime_tracking_footer')}</li>
                <li>{t('educational_articles_footer')}</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t('for_everyone')}</h5>
              <ul className="space-y-2 text-gray-300">
                <li>{t('community')}</li>
                <li>{t('field_officers')}</li>
                <li>{t('environmental_community')}</li>
                <li>{t('local_government')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} EcoCare. {t('all_rights_reserved')} 
              <span className="mx-2">•</span>
              {t('supporting_sdg12_footer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
