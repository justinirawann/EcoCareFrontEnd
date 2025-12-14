import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
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
      const response = await fetch(`http://127.0.0.1:8000/api/translations?locale=${locale}`)
      
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
      setTranslations({
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
        
        // Report Verification (Admin)
        manage_reports_title: 'Manage Reports',
        back: 'Back',
        loading: 'Loading...',
        report_title: 'Title',
        reporter: 'Reporter',
        status: 'Status',
        assigned_officer: 'Officer',
        fee: 'Fee',
        actions: 'Actions',
        verify: 'Verify',
        revision: 'Revision',
        reject: 'Reject',
        assign_officer: 'Assign Officer',
        verify_report_modal: 'Verify Report',
        write_notes_placeholder: 'Write notes for user...',
        fee_info: 'Fee will be determined by officer after direct consultation with user',
        verify_button: 'Verify',
        send_revision: 'Send Revision',
        cancel: 'Cancel',
        assign_officer_modal: 'Assign Officer',
        select_officer: 'Select Officer',
        assign: 'Assign',
        photo_report: 'Report Photo',
        close: 'Close',
        status_updated: 'Status updated successfully!',
        revision_sent: 'Revision notes sent successfully!',
        officer_assigned: 'Officer assigned successfully!',
        update_status_failed: 'Failed to update status',
        send_revision_failed: 'Failed to send revision',
        assign_officer_failed: 'Failed to assign officer',
        select_officer_first: 'Please select an officer first',
        
        // Recycling Management (Admin)
        manage_recycling_title: 'Manage Recycling Orders',
        loading_orders: 'Loading orders...',
        waste_photo: 'Waste Photo',
        no_description: 'No description',
        pickup_address: 'Pickup Address',
        price_per_kg_label: 'Price per kg (Rp)',
        price_per_kg_placeholder: 'Enter price per kg',
        admin_notes: 'Admin Notes',
        admin_notes_placeholder: 'Notes for user',
        approve: 'Approve',
        reject: 'Reject',
        cancel: 'Cancel',
        review_order: 'Review Order',
        select_officer_label: 'Select Officer',
        select_officer_placeholder: 'Select officer...',
        assign_task: 'Assign',
        assign_officer_button: '🚛 Assign Officer',
        price_per_kg: 'Price per kg',
        total_price: 'Total Price',
        assigned_officer_label: 'Assigned Officer',
        order_approved: 'Order approved successfully!',
        order_rejected: 'Order rejected!',
        officer_assigned: 'Officer assigned successfully!',
        
        // Article Management (Admin)
        manage_articles_title: 'Manage Articles',
        add_article: 'Add Article',
        add_article_short: '+ Add',
        failed_load_articles: 'Failed to load articles',
        no_articles_yet: 'No articles yet. Start by creating a new article!',
        article: 'Article',
        author: 'Author',
        date: 'Date',
        published: 'Published',
        draft: 'Draft',
        unknown: 'Unknown',
        confirm_delete_article: 'Are you sure you want to delete this article?',
        article_deleted: 'Article deleted successfully',
        failed_delete_article: 'Failed to delete article',
        edit_article: 'Edit Article',
        add_new_article: 'Add New Article',
        article_title: 'Article Title *',
        content: 'Content *',
        article_image: 'Article Image',
        current_image: 'Current image',
        click_select_image: 'Click to select image',
        created_date: 'Created Date',
        creation_date_auto: 'Article creation date (automatic)',
        publish_date: 'Publish Date',
        empty_for_draft: 'Leave empty to save as draft',
        save_article: 'Save Article',
        failed_save_article: 'Failed to save article',
        
        // User Management (Admin)
        user_management_title: 'User Management',
        add_user: 'Add User',
        add_user_short: '+ Add',
        failed_load_users: 'Failed to load users',
        no_users_yet: 'No users yet.',
        user: 'User',
        role: 'Role',
        contact: 'Contact',
        confirm_delete_user: 'Are you sure you want to delete this user?',
        user_deleted: 'User deleted successfully',
        failed_delete_user: 'Failed to delete user',
        confirm_reset_password: 'Reset password to default?',
        password_reset: 'Password reset to:',
        failed_reset_password: 'Failed to reset password',
        reset: 'Reset',
        edit_user: 'Edit User',
        add_user_title: 'Add User',
        name: 'Name',
        phone: 'Phone',
        address: 'Address',
        default_password_info: 'Default password: User = 12345678, Officer = petugas123, Admin = admin123',
        update: 'Update',
        save: 'Save',
        
        // Officer Report Tasks
        my_report_tasks_title: 'My Report Tasks',
        manage_assigned_reports: 'Manage reports assigned to you',
        failed_load_report_tasks: 'Failed to load report tasks',
        no_report_tasks: 'No report tasks assigned yet.',
        report: 'Report',
        payment: 'Payment',
        set_fee: 'Set Fee',
        edit_fee: 'Edit Fee',
        paid: 'Paid',
        unpaid: 'Unpaid',
        mark_paid: 'Mark Paid',
        mark_unpaid: 'Mark Unpaid',
        complete: 'Complete',
        completed: '✓ Completed',
        set_fee_modal: 'Set Negotiated Fee',
        edit_fee_modal: 'Edit Fee',
        fee_after_negotiation: 'Fee After Negotiation (Rp)',
        enter_negotiated_fee: 'Enter negotiated fee amount',
        consult_user_tip: 'Consult with user on-site to determine appropriate fee',
        save_fee: 'Save Fee',
        complete_report_modal: 'Complete Report?',
        ensure_work_done: 'Make sure all work is done and user is satisfied with the result!',
        yes_complete: 'Yes, Complete',
        payment_status_updated: 'Payment status successfully changed to',
        failed_update_payment: 'Failed to update payment status',
        enter_valid_fee: 'Enter a valid fee amount',
        fee_updated: 'Fee updated successfully',
        failed_update_fee: 'Failed to update fee',
        report_completed: 'Report completed successfully',
        failed_complete_report: 'Failed to complete report',
        
        // Officer Recycling Tasks
        recycling_pickup_tasks: 'Recycling Pickup Tasks',
        loading_tasks: 'Loading tasks...',
        no_tasks: 'No Tasks',
        no_recycling_tasks: 'You have no recycling pickup tasks yet',
        pickup_address: 'Pickup Address',
        price_per_kg: 'Price per kg',
        weight: 'Weight',
        total_value: 'Total Value',
        payment_status: 'Payment Status',
        admin_notes: 'Admin Notes',
        mark_paid_button: '💰 Mark Paid',
        mark_unpaid_button: '❌ Mark Unpaid',
        complete_pickup: '✅ Complete Pickup',
        ensure_payment_tip: 'Make sure user has paid before completing pickup',
        pickup_completed: '✅ Pickup completed',
        created: 'Created:',
        order_completed: 'Order completed successfully!',
        failed_complete_order: 'Failed to complete order'
      })
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = async (newLanguage) => {
    setLoading(true)
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    await fetchTranslations(newLanguage)
  }

  const t = (key, fallback) => {
    if (loading) return fallback || key
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