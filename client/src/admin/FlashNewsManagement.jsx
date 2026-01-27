import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Filter, CheckCircle, XCircle } from 'lucide-react';
import { getAllFlashNews, createFlashNews, updateFlashNews, deleteFlashNews } from '../services/api';
import toast from 'react-hot-toast';

const FlashNewsManagement = () => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('active'); // 'all', 'active', 'inactive'
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: '',
    is_active: 1,
    order_index: 0
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await getAllFlashNews();
      setNews(response.data);
    } catch (error) {
      toast.error('Failed to fetch flash news');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateFlashNews(editingNews.id, formData);
        toast.success('Flash news updated successfully');
      } else {
        await createFlashNews(formData);
        toast.success('Flash news created successfully');
      }
      fetchNews();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save flash news');
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      link: item.link || '',
      is_active: item.is_active,
      order_index: item.order_index || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flash news?')) return;
    try {
      await deleteFlashNews(id);
      toast.success('Flash news deleted successfully');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete flash news');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      link: '',
      is_active: 1,
      order_index: 0
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Flash News Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage flash news announcements
              <span className="ml-4 text-sm">
                Active: <span className="font-bold text-green-600">{news.filter(n => n.is_active === 1).length}</span> | 
                Inactive: <span className="font-bold text-red-600">{news.filter(n => n.is_active === 0).length}</span>
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <Filter className="h-4 w-4 text-slate-500" />
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  filter === 'all' ? 'bg-[#195de6] text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  filter === 'active' ? 'bg-green-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  filter === 'inactive' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Inactive
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Flash News
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Content</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(() => {
                const filteredNews = news.filter(item => {
                  if (filter === 'active') return item.is_active === 1;
                  if (filter === 'inactive') return item.is_active === 0;
                  return true;
                });

                if (filteredNews.length === 0) {
                  return (
                    <tr>
                      <td colSpan="5" className="px-6 py-12">
                        <div className="text-center">
                          <div className="bg-slate-100 dark:bg-slate-800 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            No Flash News Found
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {filter === 'active' 
                              ? 'No active flash news. Create one to display on the website.'
                              : filter === 'inactive'
                              ? 'No inactive flash news.'
                              : 'No flash news have been created yet.'}
                          </p>
                          <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            Add Flash News
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return filteredNews.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                    item.is_active === 1 ? 'bg-green-50/30 dark:bg-green-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.is_active === 1 && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* Preview of Actual Flash News Display */}
                    {item.is_active === 1 ? (
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-3 max-w-md overflow-hidden">
                        <span className="font-bold whitespace-nowrap">FLASH NEWS</span>
                        <div className="flex-1 overflow-hidden relative">
                          <div className="whitespace-nowrap animate-marquee">
                            {item.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{item.content}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.order_index}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      item.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Active (Live on Website)
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="p-2 rounded-lg bg-[#195de6] text-white hover:bg-[#1e40af] transition-colors flex items-center gap-1"
                        title="Edit Flash News"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="text-xs font-bold">Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1"
                        title="Delete Flash News"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs font-bold">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingNews ? 'Edit Flash News' : 'Add Flash News'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#195de6] text-white font-bold">
                  {editingNews ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashNewsManagement;
