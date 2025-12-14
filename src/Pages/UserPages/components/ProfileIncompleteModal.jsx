import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../contexts/LanguageContext'

function ProfileIncompleteModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  if (!isOpen) return null

  const handleEditProfile = () => {
    onClose()
    navigate('/dashboard/edit-profile')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('profile_incomplete_title')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('profile_incomplete_message')}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleEditProfile}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              {t('complete_profile_button')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
            >
              {t('later_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileIncompleteModal