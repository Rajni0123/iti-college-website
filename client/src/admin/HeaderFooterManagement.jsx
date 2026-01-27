import { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, X, Phone, Mail, Link, Globe, CheckCircle, XCircle } from 'lucide-react';
import { 
  getHeaderSettings, updateHeaderSettings, 
  getFooterSettings, updateFooterSettings,
  getAllFooterLinks, createFooterLink, updateFooterLink, deleteFooterLink 
} from '../services/api';
import toast from 'react-hot-toast';

const HeaderFooterManagement = () => {
  const [activeTab, setActiveTab] = useState('header');
  const [loading, setLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  const [headerData, setHeaderData] = useState({
    phone: '',
    email: '',
    student_portal_link: '',
    student_portal_text: '',
    ncvt_mis_link: '',
    ncvt_mis_text: '',
    staff_email_link: '',
    staff_email_text: '',
    logo_text: '',
    tagline: ''
  });

  const [footerData, setFooterData] = useState({
    about_text: '',
    facebook_link: '',
    twitter_link: '',
    linkedin_link: '',
    youtube_link: '',
    address: '',
    phone: '',
    email: '',
    copyright_text: '',
    privacy_link: '',
    terms_link: ''
  });

  const [footerLinks, setFooterLinks] = useState([]);
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '',
    category: 'quick_links',
    order_index: 0,
    is_active: 1
  });

  useEffect(() => {
    fetchHeaderSettings();
    fetchFooterSettings();
    fetchFooterLinks();
  }, []);

  const fetchHeaderSettings = async () => {
    try {
      const response = await getHeaderSettings();
      if (response.data) {
        setHeaderData(response.data);
      }
    } catch (error) {
      console.error('Error fetching header settings:', error);
    }
  };

  const fetchFooterSettings = async () => {
    try {
      const response = await getFooterSettings();
      if (response.data?.settings) {
        setFooterData(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    }
  };

  const fetchFooterLinks = async () => {
    try {
      const response = await getAllFooterLinks();
      setFooterLinks(response.data || []);
    } catch (error) {
      console.error('Error fetching footer links:', error);
      setFooterLinks([]);
    }
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHeaderSettings(headerData);
      toast.success('Header settings saved successfully');
    } catch (error) {
      toast.error('Failed to save header settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFooter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFooterSettings(footerData);
      toast.success('Footer settings saved successfully');
    } catch (error) {
      toast.error('Failed to save footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setLinkFormData({
      title: link.title,
      url: link.url,
      category: link.category,
      order_index: link.order_index,
      is_active: link.is_active
    });
    setShowLinkModal(true);
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await updateFooterLink(editingLink.id, linkFormData);
        toast.success('Link updated successfully');
      } else {
        await createFooterLink(linkFormData);
        toast.success('Link created successfully');
      }
      fetchFooterLinks();
      closeLinkModal();
    } catch (error) {
      toast.error('Failed to save link');
    }
  };

  const handleDeleteLink = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteFooterLink(id);
      toast.success('Link deleted successfully');
      fetchFooterLinks();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setEditingLink(null);
    setLinkFormData({
      title: '',
      url: '',
      category: 'quick_links',
      order_index: 0,
      is_active: 1
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Header & Footer Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage website header and footer content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'header'
              ? 'border-[#195de6] text-[#195de6]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Top Header
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'footer'
              ? 'border-[#195de6] text-[#195de6]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Footer Settings
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'links'
              ? 'border-[#195de6] text-[#195de6]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Footer Links
        </button>
      </div>

      {/* Header Settings Tab */}
      {activeTab === 'header' && (
        <form onSubmit={handleSaveHeader} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#195de6]" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={headerData.phone || ''}
                  onChange={(e) => setHeaderData({ ...headerData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="+91-1234-567-890"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Email Address</label>
                <input
                  type="email"
                  value={headerData.email || ''}
                  onChange={(e) => setHeaderData({ ...headerData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="info@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Link className="h-5 w-5 text-[#195de6]" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Student Portal Text</label>
                <input
                  type="text"
                  value={headerData.student_portal_text || ''}
                  onChange={(e) => setHeaderData({ ...headerData, student_portal_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="Student Portal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Student Portal Link</label>
                <input
                  type="text"
                  value={headerData.student_portal_link || ''}
                  onChange={(e) => setHeaderData({ ...headerData, student_portal_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">NCVT MIS Text</label>
                <input
                  type="text"
                  value={headerData.ncvt_mis_text || ''}
                  onChange={(e) => setHeaderData({ ...headerData, ncvt_mis_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="NCVT MIS"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">NCVT MIS Link</label>
                <input
                  type="text"
                  value={headerData.ncvt_mis_link || ''}
                  onChange={(e) => setHeaderData({ ...headerData, ncvt_mis_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://ncvtmis.gov.in"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Staff Email Text</label>
                <input
                  type="text"
                  value={headerData.staff_email_text || ''}
                  onChange={(e) => setHeaderData({ ...headerData, staff_email_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="Staff Email"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Staff Email Link</label>
                <input
                  type="text"
                  value={headerData.staff_email_link || ''}
                  onChange={(e) => setHeaderData({ ...headerData, staff_email_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#195de6]" />
              Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Logo Text</label>
                <input
                  type="text"
                  value={headerData.logo_text || ''}
                  onChange={(e) => setHeaderData({ ...headerData, logo_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="Maner Pvt ITI"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Tagline</label>
                <input
                  type="text"
                  value={headerData.tagline || ''}
                  onChange={(e) => setHeaderData({ ...headerData, tagline: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="Skill India | Digital India"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#195de6] text-white rounded-lg font-bold hover:bg-[#1e40af] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Header Settings'}
          </button>
        </form>
      )}

      {/* Footer Settings Tab */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About Section</h3>
            <textarea
              value={footerData.about_text || ''}
              onChange={(e) => setFooterData({ ...footerData, about_text: e.target.value })}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
              rows="3"
              placeholder="About text..."
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Facebook</label>
                <input
                  type="text"
                  value={footerData.facebook_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, facebook_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Twitter</label>
                <input
                  type="text"
                  value={footerData.twitter_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, twitter_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={footerData.linkedin_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, linkedin_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">YouTube</label>
                <input
                  type="text"
                  value={footerData.youtube_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, youtube_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2">Address</label>
                <textarea
                  value={footerData.address || ''}
                  onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  rows="2"
                  placeholder="Full address..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Phone</label>
                <input
                  type="text"
                  value={footerData.phone || ''}
                  onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="+91-9155401839"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Email</label>
                <input
                  type="text"
                  value={footerData.email || ''}
                  onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Legal & Copyright</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2">Copyright Text</label>
                <input
                  type="text"
                  value={footerData.copyright_text || ''}
                  onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="© 2024 Maner Pvt ITI. All Rights Reserved."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Privacy Policy Link</label>
                <input
                  type="text"
                  value={footerData.privacy_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, privacy_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="/privacy-policy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Terms of Service Link</label>
                <input
                  type="text"
                  value={footerData.terms_link || ''}
                  onChange={(e) => setFooterData({ ...footerData, terms_link: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="/terms-of-service"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#195de6] text-white rounded-lg font-bold hover:bg-[#1e40af] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Footer Settings'}
          </button>
        </form>
      )}

      {/* Footer Links Tab */}
      {activeTab === 'links' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Footer Links</h3>
            <button
              onClick={() => setShowLinkModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg text-sm font-bold hover:bg-[#1e40af]"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">URL</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {footerLinks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No footer links found. Add one to get started.
                  </td>
                </tr>
              ) : (
                footerLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{link.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{link.url}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{link.category.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        link.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditLink(link)}
                          className="p-2 rounded-lg bg-[#195de6] text-white hover:bg-[#1e40af]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </h3>
              <button onClick={closeLinkModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSaveLink} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={linkFormData.title}
                  onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="Link Title"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">URL *</label>
                <input
                  type="text"
                  required
                  value={linkFormData.url}
                  onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  placeholder="/page or https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
                <select
                  value={linkFormData.category}
                  onChange={(e) => setLinkFormData({ ...linkFormData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                >
                  <option value="quick_links">Quick Links</option>
                  <option value="govt_portals">Govt. Portals</option>
                  <option value="resources">Resources</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Order</label>
                  <input
                    type="number"
                    value={linkFormData.order_index}
                    onChange={(e) => setLinkFormData({ ...linkFormData, order_index: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Status</label>
                  <select
                    value={linkFormData.is_active}
                    onChange={(e) => setLinkFormData({ ...linkFormData, is_active: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#195de6] text-white rounded-lg font-bold hover:bg-[#1e40af]"
                >
                  <CheckCircle className="h-4 w-4" />
                  {editingLink ? 'Update Link' : 'Add Link'}
                </button>
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300"
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

export default HeaderFooterManagement;
