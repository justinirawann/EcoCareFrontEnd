import { useLanguage } from '../contexts/LanguageContext'

function LanguageSwitcher() {
  const { language, changeLanguage, loading } = useLanguage()

  const handleLanguageChange = (newLanguage) => {
    if (newLanguage !== language && !loading) {
      changeLanguage(newLanguage)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('id')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'id'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        disabled={loading}
      >
        ID
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        disabled={loading}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher