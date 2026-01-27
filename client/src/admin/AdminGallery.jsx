import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Image as ImageIcon,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    image: null,
    preview: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Campus', 'Workshops', 'Events', 'Students', 'Infrastructure'];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await axios.get(`${apiUrl}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to fetch gallery');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    const data = new FormData();
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      await axios.post(`${apiUrl}/admin/gallery`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Image uploaded successfully');
      fetchGallery();
      closeModal();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      await axios.delete(`${apiUrl}/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Image deleted successfully');
      fetchGallery();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ category: '', image: null, preview: null });
  };

  const filteredGallery = gallery.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Manage Gallery
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Upload and manage campus photos
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Upload Image
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                  placeholder="Search by category..."
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-12 text-center">
            <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Upload your first image to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img
                    src={`${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${item.image}`}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#195de6]/10 text-[#195de6]">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload New Image
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {formData.preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview:</p>
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#195de6] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                >
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

export default AdminGallery;
