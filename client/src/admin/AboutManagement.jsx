import { useState, useEffect } from 'react';
import { Save, Plus, X, Trash2 } from 'lucide-react';
import { getAbout, updateAbout } from '../services/api';
import toast from 'react-hot-toast';

const AboutManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image: '',
    about_title: '',
    about_description: '',
    about_image: '',
    mission_title: '',
    mission_description: '',
    vision_title: '',
    vision_description: '',
    principal_name: '',
    principal_message: '',
    principal_image: '',
    stats_json: [],
    values_json: [],
    features_json: []
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await getAbout();
      const data = response.data;
      setFormData({
        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
        hero_description: data.hero_description || '',
        hero_image: data.hero_image || '',
        about_title: data.about_title || '',
        about_description: data.about_description || '',
        about_image: data.about_image || '',
        mission_title: data.mission_title || '',
        mission_description: data.mission_description || '',
        vision_title: data.vision_title || '',
        vision_description: data.vision_description || '',
        principal_name: data.principal_name || '',
        principal_message: data.principal_message || '',
        principal_image: data.principal_image || '',
        stats_json: data.stats_json || [],
        values_json: data.values_json || [],
        features_json: data.features_json || []
      });
    } catch (error) {
      console.error('Error fetching about page:', error);
      toast.error('Failed to fetch about page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAbout(formData);
      toast.success('About page updated successfully');
    } catch (error) {
      console.error('Error updating about page:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update about page';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats_json: [...formData.stats_json, { icon: 'GraduationCap', value: '', label: '' }]
    });
  };

  const removeStat = (index) => {
    setFormData({
      ...formData,
      stats_json: formData.stats_json.filter((_, i) => i !== index)
    });
  };

  const updateStat = (index, field, value) => {
    const updated = [...formData.stats_json];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, stats_json: updated });
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values_json: [...formData.values_json, { icon: 'ShieldCheck', title: '', description: '' }]
    });
  };

  const removeValue = (index) => {
    setFormData({
      ...formData,
      values_json: formData.values_json.filter((_, i) => i !== index)
    });
  };

  const updateValue = (index, field, value) => {
    const updated = [...formData.values_json];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, values_json: updated });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features_json: [...formData.features_json, { icon: 'BookOpen', title: '', description: '' }]
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features_json: formData.features_json.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...formData.features_json];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, features_json: updated });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0e121b] dark:text-white mb-2">About Page Management</h1>
          <p className="text-[#4e6797] dark:text-gray-400">Manage all content on the About page</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#0e121b] dark:text-white mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Hero Title</label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Hero Subtitle</label>
                <input
                  type="text"
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Hero Description</label>
                <textarea
                  value={formData.hero_description}
                  onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Hero Image URL</label>
                <input
                  type="url"
                  value={formData.hero_image}
                  onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#0e121b] dark:text-white mb-4">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">About Title</label>
                <input
                  type="text"
                  value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">About Description</label>
                <textarea
                  value={formData.about_description}
                  onChange={(e) => setFormData({ ...formData, about_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  rows="5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">About Image URL</label>
                <input
                  type="url"
                  value={formData.about_image}
                  onChange={(e) => setFormData({ ...formData, about_image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#0e121b] dark:text-white mb-4">Mission & Vision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Mission Title</label>
                <input
                  type="text"
                  value={formData.mission_title}
                  onChange={(e) => setFormData({ ...formData, mission_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
                <label className="block text-sm font-semibold mb-2 mt-4 text-[#0e121b] dark:text-white">Mission Description</label>
                <textarea
                  value={formData.mission_description}
                  onChange={(e) => setFormData({ ...formData, mission_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Vision Title</label>
                <input
                  type="text"
                  value={formData.vision_title}
                  onChange={(e) => setFormData({ ...formData, vision_title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
                <label className="block text-sm font-semibold mb-2 mt-4 text-[#0e121b] dark:text-white">Vision Description</label>
                <textarea
                  value={formData.vision_description}
                  onChange={(e) => setFormData({ ...formData, vision_description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Principal's Message */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#0e121b] dark:text-white mb-4">Principal's Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Principal Name</label>
                <input
                  type="text"
                  value={formData.principal_name}
                  onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Principal Message</label>
                <textarea
                  value={formData.principal_message}
                  onChange={(e) => setFormData({ ...formData, principal_message: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                  rows="5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Principal Image URL</label>
                <input
                  type="url"
                  value={formData.principal_image}
                  onChange={(e) => setFormData({ ...formData, principal_image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Statistics</h2>
              <button
                type="button"
                onClick={addStat}
                className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm"
              >
                <Plus className="h-4 w-4" /> Add Stat
              </button>
            </div>
            <div className="space-y-4">
              {formData.stats_json.map((stat, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-[#0e121b] dark:text-white">Stat {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Icon</label>
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) => updateStat(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="GraduationCap"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="500+"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Students Trained"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Core Values</h2>
              <button
                type="button"
                onClick={addValue}
                className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm"
              >
                <Plus className="h-4 w-4" /> Add Value
              </button>
            </div>
            <div className="space-y-4">
              {formData.values_json.map((value, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-[#0e121b] dark:text-white">Value {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Icon</label>
                      <input
                        type="text"
                        value={value.icon}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="ShieldCheck"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Title</label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Excellence"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Description</label>
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        rows="2"
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Key Features</h2>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm"
              >
                <Plus className="h-4 w-4" /> Add Feature
              </button>
            </div>
            <div className="space-y-4">
              {formData.features_json.map((feature, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-semibold text-[#0e121b] dark:text-white">Feature {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Icon</label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="BookOpen"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Industry-Aligned Curriculum"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[#4e6797] dark:text-gray-400">Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        rows="2"
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#195de6] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutManagement;
