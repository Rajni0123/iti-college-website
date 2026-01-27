import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Filter, CheckCircle, XCircle } from 'lucide-react';
import { getAllHero, createHero, updateHero, deleteHero } from '../services/api';
import toast from 'react-hot-toast';
import HeroSection from '../components/HeroSection';

const HeroManagement = () => {
  const [heroes, setHeroes] = useState([]);
  const [filter, setFilter] = useState('active'); // 'all', 'active', 'inactive'
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    background_image: '',
    cta_text: '',
    cta_link: '',
    cta2_text: '',
    cta2_link: '',
    is_active: 1
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const response = await getAllHero();
      setHeroes(response.data);
    } catch (error) {
      toast.error('Failed to fetch hero sections');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHero) {
        await updateHero(editingHero.id, formData);
        toast.success('Hero section updated successfully');
      } else {
        await createHero(formData);
        toast.success('Hero section created successfully');
      }
      fetchHeroes();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save hero section');
    }
  };

  const handleEdit = (hero) => {
    setEditingHero(hero);
    setFormData({
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      background_image: hero.background_image || '',
      cta_text: hero.cta_text || '',
      cta_link: hero.cta_link || '',
      cta2_text: hero.cta2_text || '',
      cta2_link: hero.cta2_link || '',
      is_active: hero.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero section?')) return;
    try {
      await deleteHero(id);
      toast.success('Hero section deleted successfully');
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to delete hero section');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHero(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      background_image: '',
      cta_text: '',
      cta_link: '',
      cta2_text: '',
      cta2_link: '',
      is_active: 1
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Hero Section Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage homepage hero sections
              <span className="ml-4 text-sm">
                Active: <span className="font-bold text-green-600">{heroes.filter(h => h.is_active === 1).length}</span> | 
                Inactive: <span className="font-bold text-red-600">{heroes.filter(h => h.is_active === 0).length}</span>
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
              Add Hero Section
            </button>
          </div>
        </div>

        {(() => {
          const filteredHeroes = heroes.filter(hero => {
            if (filter === 'active') return hero.is_active === 1;
            if (filter === 'inactive') return hero.is_active === 0;
            return true;
          });

          if (filteredHeroes.length === 0) {
            return (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-12">
                <div className="text-center">
                  <div className="bg-slate-100 dark:bg-slate-800 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No Hero Sections Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {filter === 'active' 
                      ? 'No active hero sections. Create one to display on the homepage.'
                      : filter === 'inactive'
                      ? 'No inactive hero sections.'
                      : 'No hero sections have been created yet.'}
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Hero Section
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6">
              {filteredHeroes.map((hero) => (
            <div 
              key={hero.id} 
              className={`bg-white dark:bg-slate-900 border-2 rounded-xl shadow-lg overflow-hidden ${
                hero.is_active === 1 
                  ? 'border-green-500 dark:border-green-600' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Preview Section - Using Frontend HeroSection Component */}
              <div className="relative">
                {hero.is_active === 1 && (
                  <div className="absolute top-3 right-3 z-20 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <CheckCircle className="h-3 w-3" />
                    LIVE ON WEBSITE
                  </div>
                )}
                {/* Import from frontend HeroSection component */}
                <div className="px-4 py-4">
                  <HeroSection heroData={hero} isPreview={true} />
                </div>
              </div>
              
              {/* Details Section */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Background Image</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {hero.background_image ? (
                        <a href={hero.background_image} target="_blank" rel="noopener noreferrer" className="text-[#195de6] hover:underline">
                          View Image
                        </a>
                      ) : 'Not Set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Button</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {hero.cta_text || 'Not Set'} → {hero.cta_link || '#'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Secondary Button</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {hero.cta2_text || 'Not Set'} → {hero.cta2_link || '#'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Subtitle/Badge</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {hero.subtitle || 'Not Set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    hero.is_active 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {hero.is_active ? (
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
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(hero)} 
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold hover:bg-[#1e40af] transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(hero.id)} 
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
              ))}
            </div>
          );
        })()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingHero ? 'Edit Hero Section' : 'Add Hero Section'}
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
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Image URL</label>
                <input
                  type="url"
                  value={formData.background_image}
                  onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="Apply Online Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Button Link</label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="/apply-admission"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={formData.cta2_text}
                    onChange={(e) => setFormData({ ...formData, cta2_text: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="Explore Trades"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Button Link</label>
                  <input
                    type="text"
                    value={formData.cta2_link}
                    onChange={(e) => setFormData({ ...formData, cta2_link: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="/trades"
                  />
                </div>
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
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#195de6] text-white font-bold">
                  {editingHero ? 'Update' : 'Create'}
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

export default HeroManagement;
