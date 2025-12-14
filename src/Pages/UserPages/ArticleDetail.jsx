import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLanguage } from '../../contexts/LanguageContext'

function ArticleDetail() {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useLanguage()

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`)
      const data = await response.json()
      
      // Hanya tampilkan jika published
      if (data.published_at) {
        setArticle(data)
      } else {
        navigate("/articles")
      }
    } catch (error) {
      console.error(error)
      navigate("/articles")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading_articles')}</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">{t('article_not_found')}</p>
          <button
            onClick={() => navigate("/articles")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {t('back_to_articles')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">📚 {t('articles_title')}</h1>
          <button
            onClick={() => navigate("/articles")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            {t('back')}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {article.featured_image && (
            <img
              src={`http://127.0.0.1:8000/storage/${article.featured_image}`}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          )}
          
          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span>📝 {t('by_author')} {article.user?.name}</span>
              <span>📅 {new Date(article.published_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            {/* Description */}
            {article.description && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p className="text-gray-700 italic">{article.description}</p>
              </div>
            )}
            
            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>
        </article>
        
        {/* Back to Articles */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/articles")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            ← {t('view_other_articles')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail