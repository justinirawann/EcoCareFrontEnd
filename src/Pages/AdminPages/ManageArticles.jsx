import { useState, useEffect } from 'react';

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  // ========== FETCH ARTICLES ==========
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setArticles(data.data || []);
      setError('');
    } catch (err) {
      setError('Gagal memuat artikel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========== DELETE ARTICLE ==========
  const handleDelete = async (articleId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');

      setSuccess('Artikel berhasil dihapus');
      fetchArticles();
    } catch (err) {
      setError('Gagal menghapus artikel');
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">📰 Kelola Artikel</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            + Tambah Artikel
          </button>
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
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {articles.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">Belum ada artikel. Mulai dengan membuat artikel baru!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {articles.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col">

                    {article.featured_image && (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.description}</p>

                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                          <span>Oleh: {article.user?.name}</span>
                          <span>{new Date(article.created_at).toLocaleDateString('id-ID')}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => handleDelete(article.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded"
                          >
                            🗑️ Hapus
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                ))}
              </div>
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
  const [formData, setFormData] = useState(
    article || {
      title: '',
      description: '',
      content: '',
      featured_image: '',
      published_at: '',
    }
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
      const token = localStorage.getItem('token');

      const url = article
        ? `/api/articles/${article.id}`
        : `/api/articles`;

      const method = article ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan artikel');
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {article ? '✏️ Edit Artikel' : '✍️ Tambah Artikel Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Judul Artikel *</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Konten *</label>
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
            <label className="block text-sm font-semibold mb-2">URL Gambar</label>
            <input
              name="featured_image"
              value={formData.featured_image}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tanggal Publikasi</label>
            <input
              type="datetime-local"
              name="published_at"
              value={formData.published_at}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? '⏳ Menyimpan...' : '💾 Simpan Artikel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
