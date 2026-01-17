import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'id'
  })
  const [translations, setTranslations] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTranslations = async (locale) => {
    try {
      setError(null)
      console.log('Fetching translations for locale:', locale)
      const response = await fetch(`https://ecocare-api.up.railway.app/api/translations?locale=${locale}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Translation response:', data)
      
      if (data.status) {
        setTranslations(data.translations)
        console.log('Translations loaded:', Object.keys(data.translations).length, 'keys')
      } else {
        throw new Error('Translation API returned error status')
      }
    } catch (error) {
      console.error('Error fetching translations:', error)
      setError(error.message)
      // Use fallback translations if API fails
      setTranslations(locale === 'id' ? {
        email: 'Email',
        password: 'Password',
        full_name: 'Nama Lengkap',
        email_placeholder: 'contoh@email.com',
        password_placeholder: 'Masukkan password',
        name_placeholder: 'Nama lengkap kamu',
        login_button: 'Masuk',
        register_button: 'Daftar',
        back_to_home: 'Kembali',
        login_subtitle: 'Masuk untuk lanjutkan peduli lingkungan',
        register_subtitle: 'Daftar untuk mulai peduli lingkungan',
        remember_me: 'Ingat saya',
        no_account: 'Belum punya akun?',
        register_now: 'Daftar Sekarang',
        already_have_account: 'Sudah punya akun?',
        login_here: 'Masuk di sini',
        password_confirmation: 'Konfirmasi Password',
        password_confirmation_placeholder: 'Ulangi password',
        password_min_6: 'Password (min. 6 karakter)',
        hero_title_solution: 'Solusi',
        hero_title_smart: 'Cerdas',
        hero_title_waste: 'Pengelolaan Sampah',
        dashboard_title: 'EcoCare',
        edit_profile: 'Edit Profil',
        logout: 'Keluar',
        hello_user: 'Halo',
        lets_protect_environment: 'Mari jaga lingkungan bersama',
        protect_environment_together: 'Bersama Jaga Lingkungan!',
        report_waste_contribute: 'Laporkan sampah, pantau status, dan berkontribusi untuk lingkungan yang lebih bersih',
        main_features: 'Fitur Utama',
        create_new_report: 'Buat Laporan Baru',
        create_new_report_desc: 'Laporkan tumpukan sampah atau masalah kebersihan di sekitar Anda',
        create_now: 'Buat Sekarang',
        my_reports: 'Laporan Saya',
        my_reports_desc: 'Pantau status laporan Anda dan lihat feedback dari admin',
        view_status: 'Lihat Status',
        sell_recycling_waste: 'Jual Sampah Daur Ulang',
        sell_recycling_waste_desc: 'Jual sampah daur ulang Anda dengan harga terbaik',
        start_selling: 'Mulai Jual',
        recycling_orders: 'Pesanan Daur Ulang',
        recycling_orders_desc: 'Lihat status pesanan daur ulang Anda',
        view_orders: 'Lihat Pesanan',
        educational_articles: 'Artikel Edukasi',
        educational_articles_desc: 'Tips & panduan untuk melindungi lingkungan',
        read_articles: 'Baca Artikel',
        tips: 'Tips',
        upload_clear_photo_tip: 'Pastikan foto yang Anda upload jelas dan deskripsi lengkap agar laporan dapat diproses dengan cepat!',
        admin_dashboard_title: 'EcoCare Admin',
        admin_dashboard: 'Dashboard Admin',
        manage_ecocare_system: 'Kelola sistem EcoCare dengan kontrol penuh',
        administrator_ecocare: 'Administrator EcoCare',
        verify_reports: 'Verifikasi Laporan',
        verify_reports_desc: 'Kelola laporan sampah dari masyarakat.',
        manage_recycling: 'Kelola Daur Ulang',
        manage_recycling_desc: 'Review pesanan daur ulang dan tentukan harga.',
        manage_articles: 'Kelola Artikel',
        manage_articles_desc: 'Buat, edit, dan hapus artikel edukasi.',
        user_management: 'User Management',
        user_management_desc: 'Kelola user dan petugas dengan password default.',
        petugas_dashboard_title: 'EcoCare Petugas',
        petugas_dashboard: 'Dashboard Petugas',
        manage_waste_transport: 'Kelola tugas pengangkutan sampah dan laporan dengan efisien',
        field_officer_ecocare: 'Petugas Lapangan EcoCare',
        main_tasks: 'Tugas Utama',
        report_tasks: 'Tugas Laporan',
        report_tasks_desc: 'Kelola laporan sampah yang ditugaskan dan status pembayaran',
        view_tasks: 'Lihat Tugas',
        recycling_tasks: 'Tugas Daur Ulang',
        recycling_tasks_desc: 'Kelola tugas penjemputan sampah daur ulang yang ditugaskan',
        officer_info: 'Info Petugas',
        update_report_status_tip: 'Pastikan untuk selalu update status laporan setelah menyelesaikan tugas pengangkutan sampah!',
        back: 'Kembali',
        loading: 'Memuat...',
        cancel: 'Batal',
        save: 'Simpan',
        delete: 'Hapus',
        delete_order: 'Hapus Pesanan',
        delete_report_confirm: 'Hapus Laporan?',
        delete_order_confirm: 'Hapus Pesanan?',
        delete_warning: 'Tindakan ini tidak dapat dibatalkan',
        report_deleted: 'Laporan berhasil dihapus',
        order_deleted: 'Pesanan berhasil dihapus',
        delete_failed: 'Gagal menghapus data',
        pending_tasks: 'Tugas Tertunda',
        no_pending_tasks: 'Tidak ada tugas tertunda',
        reject_report_confirm: 'Tolak Laporan?',
        reject_warning: 'Laporan akan ditolak dan user akan mendapat notifikasi',
        reject_order_confirm: 'Tolak Pesanan?',
        reject_order_warning: 'Pesanan akan ditolak dan user akan mendapat notifikasi',
        profile_incomplete_title: 'Profil Belum Lengkap',
        profile_incomplete_message: 'Untuk membuat laporan, Anda harus melengkapi profil terlebih dahulu. Pastikan data nama, email, nomor telepon, alamat, dan foto profil sudah terisi semua.',
        complete_profile_button: 'Lengkapi Profil',
        later_button: 'Nanti Saja'
      } : {
        email: 'Email',
        password: 'Password',
        full_name: 'Full Name',
        email_placeholder: 'example@email.com',
        password_placeholder: 'Enter password',
        name_placeholder: 'Your full name',
        login_button: 'Login',
        register_button: 'Register',
        back_to_home: 'Back',
        login_subtitle: 'Login to continue caring for the environment',
        register_subtitle: 'Register to start caring for the environment',
        remember_me: 'Remember me',
        no_account: "Don't have an account?",
        register_now: 'Register Now',
        already_have_account: 'Already have an account?',
        login_here: 'Login here',
        password_confirmation: 'Confirm Password',
        password_confirmation_placeholder: 'Repeat password',
        password_min_6: 'Password (min. 6 characters)',
        hero_title_solution: 'Smart',
        hero_title_smart: 'Solution',
        hero_title_waste: 'Waste Management',
        dashboard_title: 'EcoCare',
        edit_profile: 'Edit Profile',
        logout: 'Logout',
        hello_user: 'Hello',
        lets_protect_environment: 'Let\'s protect the environment together',
        protect_environment_together: 'Protect Environment Together!',
        report_waste_contribute: 'Report waste, monitor status, and contribute to a cleaner environment',
        main_features: 'Main Features',
        create_new_report: 'Create New Report',
        create_new_report_desc: 'Report waste piles or cleanliness issues around you',
        create_now: 'Create Now',
        my_reports: 'My Reports',
        my_reports_desc: 'Monitor your report status and view admin feedback',
        view_status: 'View Status',
        sell_recycling_waste: 'Sell Recycling Waste',
        sell_recycling_waste_desc: 'Sell your recycling waste at the best price',
        start_selling: 'Start Selling',
        recycling_orders: 'Recycling Orders',
        recycling_orders_desc: 'View your recycling order status',
        view_orders: 'View Orders',
        educational_articles: 'Educational Articles',
        educational_articles_desc: 'Tips & guides for protecting the environment',
        read_articles: 'Read Articles',
        tips: 'Tips',
        upload_clear_photo_tip: 'Make sure the photos you upload are clear and the description is complete so reports can be processed quickly!',
        admin_dashboard_title: 'EcoCare Admin',
        admin_dashboard: 'Admin Dashboard',
        manage_ecocare_system: 'Manage EcoCare system with full control',
        administrator_ecocare: 'EcoCare Administrator',
        verify_reports: 'Verify Reports',
        verify_reports_desc: 'Manage waste reports from the community.',
        manage_recycling: 'Manage Recycling',
        manage_recycling_desc: 'Review recycling orders and set prices.',
        manage_articles: 'Manage Articles',
        manage_articles_desc: 'Create, edit, and delete educational articles.',
        user_management: 'User Management',
        user_management_desc: 'Manage users and officers with default passwords.',
        petugas_dashboard_title: 'EcoCare Officer',
        petugas_dashboard: 'Officer Dashboard',
        manage_waste_transport: 'Manage waste transport tasks and reports efficiently',
        field_officer_ecocare: 'EcoCare Field Officer',
        main_tasks: 'Main Tasks',
        report_tasks: 'Report Tasks',
        report_tasks_desc: 'Manage assigned waste reports and payment status',
        view_tasks: 'View Tasks',
        recycling_tasks: 'Recycling Tasks',
        recycling_tasks_desc: 'Manage assigned recycling waste pickup',
        officer_info: 'Officer Info',
        update_report_status_tip: 'Make sure to always update report status after completing waste transport tasks!',
        edit_profile_officer: 'Edit Officer Profile',
        choose_profile_photo: 'Choose Profile Photo',
        full_name_required: 'Full Name *',
        full_name_placeholder: 'Full name',
        email_required: 'Email *',
        phone_number_required: 'Phone Number *',
        phone_placeholder: 'Example: 081234567890',
        address_required: 'Address *',
        address_placeholder: 'Complete address',
        change_password: 'Change Password',
        cancel_change_password: 'Cancel Change Password',
        new_password_placeholder: 'New password (min. 6 characters)',
        confirm_new_password_placeholder: 'Confirm new password',
        saving: 'Saving...',
        save_profile: 'Save Profile',
        edit_profile_user: 'Edit User Profile',
        edit_profile_admin: 'Edit Admin Profile',
        required_fields_note_user: '* Required fields to complete user profile',
        required_fields_note_admin: '* Required fields to complete admin profile',
        required_fields_note_officer: '* Required fields to complete officer profile',
        create_waste_report: 'Create Waste Report',
        title: 'Title',
        title_placeholder: 'Example: Waste piling up...',
        location: 'Location',
        location_placeholder: 'Example: Jl. Melati No. 20',
        description: 'Description',
        description_placeholder: 'Describe the waste condition...',
        photo: 'Photo',
        click_to_select_photo: 'Click to select photo',
        photo_format_info: 'PNG, JPG, JPEG (Max 2MB)',
        send_report: 'Send Report',
        my_reports_title: 'My Reports',
        no_reports_yet: 'No reports yet',
        status_pending: 'Pending',
        status_verified: 'Verified',
        status_completed: 'Completed',
        status_rejected: 'Rejected',
        location_label: 'Location:',
        date_label: 'Date:',
        admin_notes: 'Notes from Admin:',
        edit_report: 'Edit Report',
        edit_report_title: 'Edit Report',
        current_photo: 'Current photo',
        update_report: 'Update Report',
        sell_recycling_waste_title: 'Sell Recycling Waste',
        waste_category: 'Waste Category *',
        select_waste_category: 'Select waste category',
        weight_kg: 'Weight (kg) *',
        weight_placeholder: 'Enter weight in kg',
        waste_photo: 'Waste Photo *',
        photo_selected_success: 'Waste photo successfully selected',
        select_waste_photo: 'Select waste photo',
        change_photo: 'Change Photo',
        select_photo: 'Select Photo',
        waste_description: 'Waste Description',
        waste_description_placeholder: 'Describe the condition and type of waste in detail',
        pickup_address: 'Pickup Address *',
        pickup_address_placeholder: 'Complete address for waste pickup',
        sending: 'Sending...',
        send_order: 'Send Order',
        info: 'Info',
        admin_price_info: 'Admin will determine the price per kg based on category and waste condition. Officers will be scheduled to pick up waste at the address you provide.',
        my_recycling_orders_title: 'My Recycling Orders',
        create_new_order: 'Create New Order',
        loading_orders: 'Loading orders...',
        no_orders_yet: 'No Orders Yet',
        no_orders_desc: 'You don\'t have any recycling orders yet',
        create_first_order: 'Create First Order',
        waste_photo_label: 'Waste Photo',
        no_description: 'No description',
        pickup_address_label: 'Pickup Address',
        price_per_kg: 'Price per kg',
        weight: 'Weight',
        total_price: 'Total Price',
        assigned_officer: 'Assigned Officer',
        admin_notes_label: 'Admin Notes',
        created_date: 'Created:',
        back_to_dashboard: 'Back to Dashboard',
        status_approved: 'Approved',
        status_ongoing: 'Ongoing',
        status_finished: 'Finished',
        articles_title: 'Educational Articles',
        loading_articles: 'Loading articles...',
        no_articles_available: 'No articles available yet',
        read_full_article: 'Read the full article to learn more...',
        by_author: 'By:',
        article_not_found: 'Article not found',
        back_to_articles: 'Back to Articles',
        view_other_articles: 'View Other Articles',
        
        // Additional fallback keys
        back: 'Back',
        loading: 'Loading...',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        delete_order: 'Delete Order',
        delete_report_confirm: 'Delete Report?',
        delete_order_confirm: 'Delete Order?',
        delete_warning: 'This action cannot be undone',
        report_deleted: 'Report successfully deleted',
        order_deleted: 'Order successfully deleted',
        delete_failed: 'Failed to delete data',
        pending_tasks: 'Pending Tasks',
        no_pending_tasks: 'No pending tasks',
        reject_report_confirm: 'Reject Report?',
        reject_warning: 'Report will be rejected and user will be notified',
        reject_order_confirm: 'Reject Order?',
        reject_order_warning: 'Order will be rejected and user will be notified',
        profile_incomplete_title: 'Profile Incomplete',
        profile_incomplete_message: 'To create a report, you must complete your profile first. Make sure your name, email, phone number, address, and profile photo are all filled in.',
        complete_profile_button: 'Complete Profile',
        later_button: 'Later'
      })
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = async (newLanguage) => {
    // Don't set loading to true to avoid UI flicker
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    await fetchTranslations(newLanguage)
  }

  const t = (key, fallback) => {
    // Always return translation or fallback, don't wait for loading
    return translations[key] || fallback || key
  }

  useEffect(() => {
    fetchTranslations(language)
  }, [language])

  const value = {
    language,
    changeLanguage,
    translations,
    loading,
    error,
    t,
    isIndonesian: language === 'id',
    isEnglish: language === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { useLanguage, LanguageProvider }