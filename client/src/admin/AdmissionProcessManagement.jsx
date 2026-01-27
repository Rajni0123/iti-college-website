import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { getAdmissionProcess, updateAdmissionProcess } from '../services/api';
import toast from 'react-hot-toast';

const AdmissionProcessManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_title: 'Admission Process',
    hero_subtitle: '',
    hero_description: '',
    eligibility_title: '',
    eligibility_criteria_json: [],
    steps_title: '',
    steps_json: [],
    dates_title: '',
    important_dates_json: [],
    documents_title: '',
    required_documents_json: [],
    cta_title: '',
    cta_description: '',
    cta_button_text: '',
    cta_button_link: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAdmissionProcess();
      const data = response.data;
      setFormData({
        hero_title: data.hero_title || 'Admission Process',
        hero_subtitle: data.hero_subtitle || '',
        hero_description: data.hero_description || '',
        eligibility_title: data.eligibility_title || '',
        eligibility_criteria_json: data.eligibility_criteria_json || [],
        steps_title: data.steps_title || 'Admission Journey',
        steps_json: data.steps_json || [],
        dates_title: data.dates_title || '',
        important_dates_json: data.important_dates_json || [],
        documents_title: data.documents_title || 'Required Documents Checklist',
        required_documents_json: data.required_documents_json || [],
        cta_title: data.cta_title || 'Ready to Start?',
        cta_description: data.cta_description || 'Join ITI College today and shape your future with technical excellence.',
        cta_button_text: data.cta_button_text || 'Apply Now',
        cta_button_link: data.cta_button_link || '/apply-admission'
      });
    } catch (error) {
      console.error('Error fetching admission process:', error);
      toast.error('Failed to fetch admission process content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAdmissionProcess(formData);
      toast.success('Admission process updated successfully');
    } catch (error) {
      console.error('Error updating admission process:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update admission process';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Steps Management
  const addStep = () => {
    setFormData({
      ...formData,
      steps_json: [...formData.steps_json, { 
        number: formData.steps_json.length + 1, 
        title: '', 
        description: '', 
        icon: 'FileText' 
      }]
    });
  };

  const removeStep = (index) => {
    const updated = formData.steps_json.filter((_, i) => i !== index).map((step, i) => ({ ...step, number: i + 1 }));
    setFormData({ ...formData, steps_json: updated });
  };

  const updateStep = (index, field, value) => {
    const updated = [...formData.steps_json];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, steps_json: updated });
  };

  const moveStep = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formData.steps_json.length - 1)) {
      return;
    }
    const updated = [...formData.steps_json];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((step, i) => { step.number = i + 1; });
    setFormData({ ...formData, steps_json: updated });
  };

  // Required Documents Management
  const addDocument = () => {
    setFormData({
      ...formData,
      required_documents_json: [...formData.required_documents_json, '']
    });
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      required_documents_json: formData.required_documents_json.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index, value) => {
    const updated = [...formData.required_documents_json];
    updated[index] = value;
    setFormData({ ...formData, required_documents_json: updated });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#195de6] mx-auto mb-4"></div>
          <p className="text-[#4e6797] dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const iconOptions = ['FileText', 'CheckCircle', 'UserCheck', 'CreditCard', 'Upload', 'Clock', 'Award', 'ShieldCheck'];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0e121b] dark:text-white mb-2">Admission Process Management</h1>
          <p className="text-[#4e6797] dark:text-gray-400">Manage the Admission Journey and Required Documents sections</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="h-5 w-5 text-[#195de6] shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Content Display on Public Page:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Page shows a two-column layout with Admission Journey on the left and Required Documents on the right</li>
              <li>Steps are displayed in a vertical timeline format with icons</li>
              <li>Documents are shown in a grid with automatic mandatory/optional badge detection</li>
              <li>Add "(if applicable)" or "(if required)" to document names to mark them as optional</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Admission Steps */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#195de6]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Admission Journey</h2>
                  <input
                    type="text"
                    value={formData.steps_title}
                    onChange={(e) => setFormData({ ...formData, steps_title: e.target.value })}
                    placeholder="Section Title"
                    className="mt-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Add Step
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.steps_json.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No steps added yet. Click "Add Step" to get started.</p>
                </div>
              ) : (
                formData.steps_json.map((step, index) => (
                  <div key={index} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#195de6] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {step.number || index + 1}
                        </div>
                        <span className="text-sm font-semibold text-[#0e121b] dark:text-white">Step {step.number || index + 1}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-[#195de6] hover:bg-[#195de6]/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === formData.steps_json.length - 1}
                            className="p-1.5 text-[#195de6] hover:bg-[#195de6]/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"
                        title="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-[#4e6797] dark:text-gray-400">Icon</label>
                        <select
                          value={step.icon}
                          onChange={(e) => updateStep(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#195de6] focus:border-transparent"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-[#4e6797] dark:text-gray-400">Title *</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#195de6] focus:border-transparent"
                          placeholder="e.g., Online Registration"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold mb-2 text-[#4e6797] dark:text-gray-400">Description *</label>
                        <textarea
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#195de6] focus:border-transparent resize-none"
                          placeholder="Brief description of this step"
                          rows="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#195de6]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Required Documents</h2>
                  <input
                    type="text"
                    value={formData.documents_title}
                    onChange={(e) => setFormData({ ...formData, documents_title: e.target.value })}
                    placeholder="Section Title"
                    className="mt-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addDocument}
                className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Add Document
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.required_documents_json.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No documents added yet. Click "Add Document" to get started.</p>
                </div>
              ) : (
                formData.required_documents_json.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-[#4e6797] dark:text-gray-400 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDocument(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent"
                        placeholder="e.g., 10th Marksheet (Original + 2 self-attested copies)"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5 rounded transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Tip:</strong> Add "(if applicable)" or "(if required)" to mark documents as optional. These will appear with an amber badge instead of blue.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#195de6]/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h2 className="text-xl font-bold text-[#0e121b] dark:text-white">Call to Action Banner</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">CTA Title *</label>
                <input
                  type="text"
                  value={formData.cta_title}
                  onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                  placeholder="e.g., Ready to Start?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">CTA Description *</label>
                <textarea
                  value={formData.cta_description}
                  onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                  rows="2"
                  placeholder="e.g., Join ITI College today and shape your future with technical excellence."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Button Text *</label>
                  <input
                    type="text"
                    value={formData.cta_button_text}
                    onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                    placeholder="e.g., Apply Now"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">Button Link *</label>
                  <input
                    type="text"
                    value={formData.cta_button_link}
                    onChange={(e) => setFormData({ ...formData, cta_button_link: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                    placeholder="/apply-admission"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={fetchData}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-[#195de6] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#195de6]/20"
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

export default AdmissionProcessManagement;
