import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function ProfileCompleteCheck({ children }) {
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          
          const requiredFields = ['name', 'email', 'phone', 'address', 'image']
          const isComplete = requiredFields.every(field => 
            userData[field] && userData[field].toString().trim() !== ''
          )

          if (!isComplete) {
            navigate('/dashboard')
            return
          }

          setIsProfileComplete(true)
        } else {
          navigate('/dashboard')
        }
      } catch (error) {
        console.error("Error checking profile:", error)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkProfile()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!isProfileComplete) {
    return null
  }

  return children
}

export default ProfileCompleteCheck