import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Upload, FileText, CheckCircle, Trash2, Search, Globe, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getFeeStructurePdfInfo, uploadFeeStructurePdf, getFaviconInfo, uploadFavicon } from '../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    header_text: '',
    principal_name: '',
    principal_message: '',
    principal_image: '',
    credit_card_enabled: 'true',
    credit_card_title: '',
    credit_card_description: '',
    // SEO Settings
    seo_title: 'ITI College - Technical Education & Skill Development',
    seo_description: 'ITI College - Official website for technical education and skill development',
    seo_keywords: 'ITI, Technical Education, Vocational Training, Electrician, Fitter, Welder, Mechanic',
    seo_author: 'Maner Pvt ITI',
    seo_og_title: '',
    seo_og_description: '',
    seo_og_image: '',
    seo_twitter_card: 'summary_large_image',
    seo_twitter_site: '',
    seo_google_site_verification: '',
    seo_robots: 'index, follow'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfInfo, setPdfInfo] = useState({ exists: false });
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [faviconInfo, setFaviconInfo] = useState({ exists: false });
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchPdfInfo();
    fetchFaviconInfo();
  }, []);

  const fetchPdfInfo = async () => {
    try {
      const response = await getFeeStructurePdfInfo();
      setPdfInfo(response.data);
    } catch (error) {
      console.error('Error fetching PDF info:', error);
    }
  };

  const fetchFaviconInfo = async () => {
    try {
      const response = await getFaviconInfo();
      setFaviconInfo(response.data);
    } catch (error) {
      console.error('Error fetching favicon info:', error);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/x-icon', 'image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(ico|png|svg|jpg|jpeg)$/i)) {
      toast.error('Favicon must be .ico, .png, .svg, .jpg, or .jpeg');
      return;
    }

    setUploadingFavicon(true);
    const formData = new FormData();
    formData.append('favicon', file);

    try {
      await uploadFavicon(formData);
      toast.success('Favicon uploaded successfully');
      fetchFaviconInfo();
      // Reload page to see new favicon
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error('Failed to upload favicon');
    } finally {
      setUploadingFavicon(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    setUploadingPdf(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await uploadFeeStructurePdf(formData);
      toast.success('Fee Structure PDF uploaded successfully');
      fetchPdfInfo();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
      e.target.value = ''; // Reset file input
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await axios.get(`${apiUrl}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Merge with defaults to handle missing settings
      setSettings({
        header_text: response.data.header_text || settings.header_text,
        principal_name: response.data.principal_name || settings.principal_name,
        principal_message: response.data.principal_message || settings.principal_message,
        principal_image: response.data.principal_image || settings.principal_image,
        credit_card_enabled: response.data.credit_card_enabled || settings.credit_card_enabled,
        credit_card_title: response.data.credit_card_title || settings.credit_card_title,
        credit_card_description: response.data.credit_card_description || settings.credit_card_description,
        // SEO Settings
        seo_title: response.data.seo_title || settings.seo_title,
        seo_description: response.data.seo_description || settings.seo_description,
        seo_keywords: response.data.seo_keywords || settings.seo_keywords,
        seo_author: response.data.seo_author || settings.seo_author,
        seo_og_title: response.data.seo_og_title || settings.seo_og_title,
        seo_og_description: response.data.seo_og_description || settings.seo_og_description,
        seo_og_image: response.data.seo_og_image || settings.seo_og_image,
        seo_twitter_card: response.data.seo_twitter_card || settings.seo_twitter_card,
        seo_twitter_site: response.data.seo_twitter_site || settings.seo_twitter_site,
        seo_google_site_verification: response.data.seo_google_site_verification || settings.seo_google_site_verification,
        seo_robots: response.data.seo_robots || settings.seo_robots
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings. Using default values.');
      // Keep default values already set in state
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      await axios.put(`${apiUrl}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="text-center py-12">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Site Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage homepage content and site configuration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flash News Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <SettingsIcon className="h-5 w-5 text-[#195de6]" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Flash News Header
              </h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Header Text (Marquee)
              </label>
              <textarea
                name="header_text"
                value={settings.header_text}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Enter the scrolling text that appears in the header..."
              />
            </div>
          </div>

          {/* Principal's Message */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <SettingsIcon className="h-5 w-5 text-[#195de6]" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Principal's Message
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Principal Name
                </label>
                <input
                  type="text"
                  name="principal_name"
                  value={settings.principal_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g., Dr. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Principal's Image URL
                </label>
                <input
                  type="url"
                  name="principal_image"
                  value={settings.principal_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
                {settings.principal_image && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Preview:</p>
                    <img
                      src={settings.principal_image}
                      alt="Principal"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#195de6]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  name="principal_message"
                  value={settings.principal_message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter the principal's message..."
                />
              </div>
            </div>
          </div>

          {/* Student Credit Card Facility */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <SettingsIcon className="h-5 w-5 text-[#195de6]" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Credit Card Facility
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="credit_card_enabled"
                  name="credit_card_enabled"
                  checked={settings.credit_card_enabled === 'true'}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#195de6] border-slate-300 rounded focus:ring-[#195de6]"
                />
                <label htmlFor="credit_card_enabled" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Student Credit Card Section on Homepage
                </label>
              </div>

              {settings.credit_card_enabled === 'true' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="credit_card_title"
                      value={settings.credit_card_title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="e.g., Student Credit Card Facility Available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="credit_card_description"
                      value={settings.credit_card_description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="Enter the description for the credit card facility..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="h-5 w-5 text-[#195de6]" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SEO Settings (Search Engine Optimization)
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    name="seo_title"
                    value={settings.seo_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="ITI College - Technical Education"
                    maxLength={60}
                  />
                  <p className="text-xs text-slate-500 mt-1">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Meta Description *
                  </label>
                  <textarea
                    name="seo_description"
                    value={settings.seo_description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Brief description of your website"
                    maxLength={160}
                  />
                  <p className="text-xs text-slate-500 mt-1">Recommended: 150-160 characters</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  name="seo_keywords"
                  value={settings.seo_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-slate-500 mt-1">Separate keywords with commas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    name="seo_author"
                    value={settings.seo_author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Maner Pvt ITI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Robots
                  </label>
                  <select
                    name="seo_robots"
                    value={settings.seo_robots}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Open Graph (Facebook, LinkedIn)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      name="seo_og_title"
                      value={settings.seo_og_title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="Leave empty to use page title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      OG Description
                    </label>
                    <textarea
                      name="seo_og_description"
                      value={settings.seo_og_description}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="Leave empty to use meta description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      name="seo_og_image"
                      value={settings.seo_og_image}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended: 1200x630px image</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Twitter Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      name="seo_twitter_card"
                      value={settings.seo_twitter_card}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Twitter Site (@username)
                    </label>
                    <input
                      type="text"
                      name="seo_twitter_site"
                      value={settings.seo_twitter_site}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="@yourusername"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Google Site Verification Code
                </label>
                <input
                  type="text"
                  name="seo_google_site_verification"
                  value={settings.seo_google_site_verification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#195de6] focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter code from Google Search Console"
                />
                <p className="text-xs text-slate-500 mt-1">Get this from Google Search Console after verifying your site</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Fee Structure PDF Upload - Outside the form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <FileText className="h-5 w-5 text-[#195de6]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Fee Structure PDF
            </h3>
          </div>
          
          <div className="space-y-4">
            {pdfInfo.exists ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-bold text-green-800 dark:text-green-300">Fee Structure PDF Uploaded</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Last updated: {pdfInfo.updated_at ? new Date(pdfInfo.updated_at).toLocaleString('en-IN') : 'N/A'}
                  </p>
                </div>
                <a
                  href={`${import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api'}/settings/fee-structure/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <FileText className="h-8 w-8 text-amber-600" />
                <div className="flex-1">
                  <p className="font-bold text-amber-800 dark:text-amber-300">No Fee Structure PDF Uploaded</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Upload a PDF to enable download on the Fee Structure page
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {pdfInfo.exists ? 'Replace Fee Structure PDF' : 'Upload Fee Structure PDF'}
              </label>
              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer font-bold text-sm transition-colors ${
                  uploadingPdf 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-[#195de6] text-white hover:bg-[#1e40af]'
                }`}>
                  <Upload className="h-4 w-4" />
                  {uploadingPdf ? 'Uploading...' : 'Select PDF File'}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploadingPdf}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-slate-500">PDF files only, max 10MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Favicon Upload - Outside the form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <ImageIcon className="h-5 w-5 text-[#195de6]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Website Favicon
            </h3>
          </div>
          
          <div className="space-y-4">
            {faviconInfo.exists ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-bold text-green-800 dark:text-green-300">Favicon Uploaded</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Last updated: {faviconInfo.updated_at ? new Date(faviconInfo.updated_at).toLocaleString('en-IN') : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={`${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${faviconInfo.filename}`}
                    alt="Favicon Preview"
                    className="w-16 h-16 object-contain border border-slate-300 rounded"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <ImageIcon className="h-8 w-8 text-amber-600" />
                <div className="flex-1">
                  <p className="font-bold text-amber-800 dark:text-amber-300">No Favicon Uploaded</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Upload a favicon to display in browser tabs and bookmarks
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {faviconInfo.exists ? 'Replace Favicon' : 'Upload Favicon'}
              </label>
              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer font-bold text-sm transition-colors ${
                  uploadingFavicon 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-[#195de6] text-white hover:bg-[#1e40af]'
                }`}>
                  <Upload className="h-4 w-4" />
                  {uploadingFavicon ? 'Uploading...' : 'Select Favicon File'}
                  <input
                    type="file"
                    accept=".ico,.png,.svg,.jpg,.jpeg"
                    onChange={handleFaviconUpload}
                    disabled={uploadingFavicon}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-slate-500">.ico, .png, .svg, .jpg, or .jpeg (max 2MB)</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: Use .ico format for best compatibility, or .png with 32x32px or 16x16px dimensions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
