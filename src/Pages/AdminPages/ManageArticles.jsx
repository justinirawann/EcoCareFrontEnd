import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchArticles();
  }, []);

  // ========== FETCH ARTICLES ==========
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await fetch('https://ecocare-api.up.railway.app/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Handle pagination response
      if (data.data && Array.isArray(data.data)) {
        setArticles(data.data);
      } else if (Array.isArray(data)) {
        setArticles(data);
      } else {
        setArticles([]);
      }
      setError('');
    } catch (err) {
      setError(t('failed_load_articles'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========== DELETE ARTICLE ==========
  const handleDelete = async (articleId) => {
    if (!window.confirm(t('confirm_delete_article'))) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await fetch(`https://ecocare-api.up.railway.app/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');

      setSuccess(t('article_deleted'));
      fetchArticles();
    } catch (err) {
      setError(t('failed_delete_article'));
      console.error(err);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleFormSubmit = async () => {
    fetchArticles();
    handleCloseForm();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">{t('back')}</span>
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">📰 {t('manage_articles_title')}</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <span className="sm:hidden">{t('add_article_short')}</span>
              <span className="hidden sm:inline">{t('add_article')}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="mt-4 text-gray-600 font-medium">{t('loading')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {articles.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">{t('no_articles_yet')}</p>
              </div>
            ) : (
              <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-4 p-4">
                {articles.map((article) => (
                  <div key={article.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex space-x-3">
                      {article.featured_image && (
                        <img
                          src={`https://ecocare-api.up.railway.app/storage/${article.featured_image}`}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.user?.name || t('unknown')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            article.published_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.published_at ? t('published') : t('draft')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(article.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artikel</th>
                      <th className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-6 py-4">
                          <div className="flex items-start space-x-2 lg:space-x-4">
                            {article.featured_image && (
                              <img
                                src={`https://ecocare-api.up.railway.app/storage/${article.featured_image}`}
                                alt={article.title}
                                className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                              <p className="text-sm text-gray-500 mt-1 md:hidden">{article.user?.name || t('unknown')}</p>
                              <p className="text-xs lg:text-sm text-gray-500 mt-1 line-clamp-1 lg:line-clamp-2">{article.description || t('no_description')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{article.user?.name || t('unknown')}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            article.published_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.published_at ? t('published') : t('draft')}
                          </span>
                          <div className="lg:hidden text-xs text-gray-500 mt-1">
                            {new Date(article.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-1 lg:space-y-0">
                            <button
                              onClick={() => handleEdit(article)}
                              className="text-blue-600 hover:text-blue-900 text-xs lg:text-sm"
                            >
                              {t('edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 hover:text-red-900 text-xs lg:text-sm"
                            >
                              {t('delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </div>
        )}

        {showForm && (
          <ArticleForm
            article={editingArticle}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}

// ===================================
//           ARTICLE FORM
// ===================================
function ArticleForm({ article, onClose, onSubmit }) {
  const { t } = useLanguage();
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState(
    article ? {
      title: article.title || '',
      description: article.description || '',
      content: article.content || '',
      featured_image: article.featured_image || '',
      published_at: article.published_at || '',
      created_at: article.created_at || '',
    } : {
      title: '',
      description: '',
      content: '',
      featured_image: '',
      published_at: '',
      created_at: getCurrentDateTime(),
    }
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    article?.featured_image ? `https://ecocare-api.up.railway.app/storage/${article.featured_image}` : null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========== CREATE / UPDATE WITH FETCH ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const url = article
        ? `https://ecocare-api.up.railway.app/api/articles/${article.id}`
        : `https://ecocare-api.up.railway.app/api/articles`;

      const method = article ? 'PUT' : 'POST';

      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      if (formData.published_at) {
        formDataToSend.append('published_at', formData.published_at);
      }
      if (imageFile) {
        formDataToSend.append('featured_image', imageFile);
      }
      if (article && method === 'PUT') {
        formDataToSend.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: article ? 'POST' : 'POST', // Always POST for FormData with _method
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('failed_save_article'));
      }

      onSubmit();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-2 border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {article ? `✏️ ${t('edit_article')}` : `✍️ ${t('add_new_article')}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">{t('article_title')}</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('content')}</label>
            <textarea
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-none"
              rows="8"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('article_image')}</label>
            {imagePreview && (
              <div className="mb-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-w-sm rounded-lg border-2 border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">{t('current_image')}</p>
              </div>
            )}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-600 font-medium">{t('click_select_image')}</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 2MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  setImageFile(file)
                  if (file) {
                    setImagePreview(URL.createObjectURL(file))
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('created_date')}</label>
            <input
              type="datetime-local"
              value={formData.created_at}
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
              disabled
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">{t('creation_date_auto')}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('publish_date')}</label>
            <input
              type="datetime-local"
              name="published_at"
              value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
              className="w-full border px-3 py-2 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">{t('empty_for_draft')}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? `⏳ ${t('saving')}` : `💾 ${t('save_article')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
