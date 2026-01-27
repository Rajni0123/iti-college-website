import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, FileText, Download, Eye, Save, XCircle, CheckCircle } from 'lucide-react';
import { getAllTrades, createTrade, updateTrade, deleteTrade } from '../services/api';
import toast from 'react-hot-toast';

const TradeManagement = () => {
  const [trades, setTrades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [viewingTrade, setViewingTrade] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Engineering Trade',
    description: '',
    image: '',
    duration: '',
    eligibility: '',
    seats: '',
    is_active: 1,
    syllabus_json: [],
    careers_json: []
  });
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [prospectusPdf, setProspectusPdf] = useState(null);
  const [currentProspectusPdf, setCurrentProspectusPdf] = useState(null);
  const [removeProspectusPdf, setRemoveProspectusPdf] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await getAllTrades();
      // Handle both array response and object with data property
      const tradesData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data || []);
      setTrades(tradesData);
      
      if (tradesData.length === 0) {
        console.warn('No trades found. The database may be empty or the server needs to be restarted.');
      } else {
        console.log(`Successfully fetched ${tradesData.length} trades for admin`);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch trades';
      
      // Provide specific error messages based on error type
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 404) {
        toast.error('Trades endpoint not found. Please ensure the server is running and routes are configured.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please check the server logs and try again.');
      } else if (!error.response) {
        toast.error('Network error. Please check your connection and ensure the server is running.');
      } else {
        toast.error(errorMessage);
      }
      
      // Set empty array on error so UI still renders
      setTrades([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.slug || !formData.category || !formData.description || !formData.duration || !formData.eligibility || !formData.seats) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('slug', formData.slug.trim());
      data.append('category', formData.category.trim());
      data.append('description', formData.description.trim());
      data.append('image', formData.image || '');
      data.append('duration', formData.duration.trim());
      data.append('eligibility', formData.eligibility.trim());
      data.append('seats', formData.seats.trim());
      data.append('is_active', formData.is_active ? 1 : 0);
      data.append('syllabus_json', JSON.stringify(formData.syllabus_json || []));
      data.append('careers_json', JSON.stringify(formData.careers_json || []));
      
      if (syllabusPdf) {
        data.append('syllabus_pdf', syllabusPdf);
      }
      if (removePdf && editingTrade) {
        data.append('remove_pdf', 'true');
      }
      if (prospectusPdf) {
        data.append('prospectus_pdf', prospectusPdf);
      }
      if (removeProspectusPdf && editingTrade) {
        data.append('remove_prospectus_pdf', 'true');
      }

      if (editingTrade) {
        await updateTrade(editingTrade.id, data);
        toast.success('Trade updated successfully');
      } else {
        await createTrade(data);
        toast.success('Trade created successfully');
      }
      fetchTrades();
      closeModal();
    } catch (error) {
      console.error('Error saving trade:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save trade';
      console.error('Error details:', error.response?.data || error);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setFormData({
      name: trade.name,
      slug: trade.slug,
      category: trade.category,
      description: trade.description,
      image: trade.image || '',
      duration: trade.duration,
      eligibility: trade.eligibility,
      seats: trade.seats,
      is_active: trade.is_active,
      syllabus_json: trade.syllabus_json || [],
      careers_json: trade.careers_json || []
    });
    setCurrentPdf(trade.syllabus_pdf);
    setCurrentProspectusPdf(trade.prospectus_pdf);
    setSyllabusPdf(null);
    setProspectusPdf(null);
    setRemovePdf(false);
    setRemoveProspectusPdf(false);
    setShowModal(true);
  };

  const handleView = (trade) => {
    setViewingTrade(trade);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    try {
      await deleteTrade(id);
      toast.success('Trade deleted successfully');
      fetchTrades();
    } catch (error) {
      toast.error('Failed to delete trade');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrade(null);
    setSyllabusPdf(null);
    setCurrentPdf(null);
    setRemovePdf(false);
    setFormData({
      name: '',
      slug: '',
      category: 'Engineering Trade',
      description: '',
      image: '',
      duration: '',
      eligibility: '',
      seats: '',
      is_active: 1,
      syllabus_json: [],
      careers_json: []
    });
  };

  const addSyllabusModule = () => {
    setFormData({
      ...formData,
      syllabus_json: [...formData.syllabus_json, { title: '', topics: [] }]
    });
  };

  const updateSyllabusModule = (index, field, value) => {
    const updated = [...formData.syllabus_json];
    updated[index][field] = value;
    setFormData({ ...formData, syllabus_json: updated });
  };

  const addTopic = (moduleIndex) => {
    const updated = [...formData.syllabus_json];
    updated[moduleIndex].topics.push('');
    setFormData({ ...formData, syllabus_json: updated });
  };

  const updateTopic = (moduleIndex, topicIndex, value) => {
    const updated = [...formData.syllabus_json];
    updated[moduleIndex].topics[topicIndex] = value;
    setFormData({ ...formData, syllabus_json: updated });
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    const updated = [...formData.syllabus_json];
    updated[moduleIndex].topics.splice(topicIndex, 1);
    setFormData({ ...formData, syllabus_json: updated });
  };

  const removeSyllabusModule = (index) => {
    const updated = formData.syllabus_json.filter((_, i) => i !== index);
    setFormData({ ...formData, syllabus_json: updated });
  };

  const addCareer = () => {
    setFormData({
      ...formData,
      careers_json: [...formData.careers_json, { title: '', description: '' }]
    });
  };

  const updateCareer = (index, field, value) => {
    const updated = [...formData.careers_json];
    updated[index][field] = value;
    setFormData({ ...formData, careers_json: updated });
  };

  const removeCareer = (index) => {
    const updated = formData.careers_json.filter((_, i) => i !== index);
    setFormData({ ...formData, careers_json: updated });
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Trade Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage trade information, syllabus, and career opportunities
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-semibold shadow-md hover:bg-[#1e40af] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Trade
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trades.map((trade) => (
            <div key={trade.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{trade.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{trade.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trade.is_active === 1 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trade.is_active === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{trade.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div>
                    <span className="text-slate-500">Duration:</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{trade.duration}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Seats:</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{trade.seats}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Eligibility:</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{trade.eligibility}</p>
                  </div>
                </div>
                {trade.syllabus_pdf && (
                  <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-700 dark:text-blue-400">Syllabus PDF uploaded</span>
                    <a 
                      href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${trade.syllabus_pdf}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(trade)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(trade)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#195de6] text-white text-sm font-semibold hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Modal */}
      {viewingTrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewingTrade.name}</h3>
              <button onClick={() => setViewingTrade(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{viewingTrade.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Duration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{viewingTrade.duration}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Eligibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{viewingTrade.eligibility}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Seats</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{viewingTrade.seats}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{viewingTrade.category}</p>
                </div>
              </div>
              {viewingTrade.syllabus_pdf && (
                <div>
                  <h4 className="font-semibold mb-2">Syllabus PDF</h4>
                    <a 
                      href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${viewingTrade.syllabus_pdf}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </a>
                </div>
              )}
              {viewingTrade.syllabus_json && viewingTrade.syllabus_json.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Syllabus Modules</h4>
                  <div className="space-y-3">
                    {viewingTrade.syllabus_json.map((module, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-semibold text-sm mb-2">{module.title}</p>
                        <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                          {module.topics.map((topic, tIdx) => (
                            <li key={tIdx}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewingTrade.careers_json && viewingTrade.careers_json.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Career Opportunities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {viewingTrade.careers_json.map((career, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-semibold text-sm mb-1">{career.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{career.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingTrade ? 'Edit Trade' : 'Add Trade'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trade Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                    }}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="electrician"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                >
                  <option value="Engineering Trade">Engineering Trade</option>
                  <option value="Non-Engineering Trade">Non-Engineering Trade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="2 Years (4 Semesters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Eligibility *</label>
                  <input
                    type="text"
                    required
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="10th Pass"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Seats *</label>
                  <input
                    type="text"
                    required
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="60 Seats (Per Session)"
                  />
                </div>
              </div>

              {/* Syllabus PDF Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Syllabus PDF</label>
                {currentPdf && !removePdf && (
                  <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700 dark:text-blue-400">Current PDF: {currentPdf.split('/').pop()}</span>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${currentPdf}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => setRemovePdf(true)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {removePdf && (
                  <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs text-red-700 dark:text-red-400">
                    PDF will be removed on save
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Check file size (50MB limit)
                      const maxSize = 50 * 1024 * 1024; // 50MB
                      if (file.size > maxSize) {
                        toast.error(`File size exceeds 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      // Check file type
                      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                      if (!allowedTypes.includes(file.type)) {
                        toast.error('Only PDF and image files (JPEG, PNG) are allowed');
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      setSyllabusPdf(file);
                      toast.success(`File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
                    }
                    setRemovePdf(false);
                  }}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                />
                {syllabusPdf && (
                  <p className="mt-2 text-xs text-green-600">New file selected: {syllabusPdf.name}</p>
                )}
              </div>

              {/* College Prospectus PDF */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                  College Prospectus PDF
                </label>
                {currentProspectusPdf && !removeProspectusPdf && (
                  <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#195de6]" />
                        <a
                          href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${currentProspectusPdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#195de6] hover:underline"
                        >
                          View Current PDF
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRemoveProspectusPdf(true)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {removeProspectusPdf && (
                  <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg text-xs text-red-700 dark:text-red-400">
                    PDF will be removed on save
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Check file size (50MB limit)
                      const maxSize = 50 * 1024 * 1024; // 50MB
                      if (file.size > maxSize) {
                        toast.error(`File size exceeds 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      // Check file type
                      const allowedTypes = ['application/pdf'];
                      if (!allowedTypes.includes(file.type)) {
                        toast.error('Only PDF files are allowed');
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      setProspectusPdf(file);
                      setRemoveProspectusPdf(false);
                      toast.success(`File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                />
                {prospectusPdf && (
                  <p className="mt-2 text-xs text-green-600">New file selected: {prospectusPdf.name}</p>
                )}
              </div>

              {/* Syllabus Modules */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Syllabus Modules</label>
                  <button
                    type="button"
                    onClick={addSyllabusModule}
                    className="text-xs px-3 py-1 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    + Add Module
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.syllabus_json.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateSyllabusModule(moduleIndex, 'title', e.target.value)}
                          placeholder="Module Title"
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-sm font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeSyllabusModule(moduleIndex)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={topic}
                              onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                              placeholder="Topic name"
                              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border-none rounded-lg text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeTopic(moduleIndex, topicIndex)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addTopic(moduleIndex)}
                          className="text-xs px-2 py-1 text-[#195de6] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          + Add Topic
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium">Career Opportunities</label>
                  <button
                    type="button"
                    onClick={addCareer}
                    className="text-xs px-3 py-1 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    + Add Career
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.careers_json.map((career, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={career.title}
                          onChange={(e) => updateCareer(index, 'title', e.target.value)}
                          placeholder="Career Title"
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-sm font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeCareer(index)}
                          className="ml-2 p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        value={career.description}
                        onChange={(e) => updateCareer(index, 'description', e.target.value)}
                        placeholder="Career description"
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-sm resize-none"
                      />
                    </div>
                  ))}
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

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#195de6] text-white font-semibold hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingTrade ? 'Update Trade' : 'Create Trade'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
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

export default TradeManagement;
