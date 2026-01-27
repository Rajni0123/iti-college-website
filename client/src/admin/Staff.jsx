import { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Phone, Edit, Trash2, X, Save, Eye, EyeOff, Lock, Shield, CheckSquare, Square } from 'lucide-react';
import { getAllStaff, createStaff, updateStaff, deleteStaff, getDefaultPermissions } from '../services/api';
import toast from 'react-hot-toast';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [defaultPermissions, setDefaultPermissions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    permissions: {},
    is_active: true
  });

  useEffect(() => {
    fetchStaff();
    fetchDefaultPermissions();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllStaff();
      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultPermissions = async () => {
    try {
      const response = await getDefaultPermissions();
      if (response.data.success) {
        setDefaultPermissions(response.data.data);
        if (!formData.permissions || Object.keys(formData.permissions).length === 0) {
          setFormData(prev => ({ ...prev, permissions: response.data.data }));
        }
      }
    } catch (error) {
      console.error('Error fetching default permissions:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      password: '',
      phone: member.phone || '',
      role: member.role || 'staff',
      permissions: member.permissions || defaultPermissions,
      is_active: member.is_active !== undefined ? member.is_active : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (!editingStaff && !formData.password) {
      toast.error('Password is required for new staff');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const submitData = { ...formData };
      if (!submitData.password || submitData.password === '') {
        delete submitData.password;
      }

      if (editingStaff) {
        await updateStaff(editingStaff.id, submitData);
        toast.success('Staff updated successfully');
      } else {
        await createStaff(submitData);
        toast.success('Staff created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(error.response?.data?.message || 'Failed to save staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    try {
      await deleteStaff(id);
      toast.success('Staff deleted successfully');
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error(error.response?.data?.message || 'Failed to delete staff');
    }
  };

  const togglePermission = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'staff',
      permissions: defaultPermissions,
      is_active: true
    });
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(member => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const permissionGroups = [
    {
      title: 'Content Management',
      permissions: ['notices', 'results', 'gallery', 'admissions', 'fees', 'students']
    },
    {
      title: 'System Management',
      permissions: ['faculty', 'trades', 'about', 'admissionProcess', 'menus', 'categories', 'hero', 'flashNews', 'headerFooter']
    },
    {
      title: 'Administration',
      permissions: ['settings', 'staff', 'dashboard', 'profile']
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Staff Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">Manage staff members and their admin panel access</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#195de6] text-white text-sm font-bold shadow-lg hover:bg-[#1e40af] transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#195de6] mx-auto mb-4"></div>
              <p className="text-slate-500">Loading staff...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-12 text-center">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No staff members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Staff Member</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Permissions</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStaff.map((member) => {
                    const activePermissions = Object.values(member.permissions || {}).filter(p => p === true).length;
                    const totalPermissions = Object.keys(member.permissions || {}).length;
                    
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name || 'No Name'}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                            {member.phone && (
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            member.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {member.role === 'admin' ? 'Admin' : 'Staff'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {member.role === 'admin' ? (
                            <span className="text-xs text-slate-500">Full Access</span>
                          ) : (
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {activePermissions} / {totalPermissions} enabled
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">
                              <Eye className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 rounded-full text-xs font-bold">
                              <EyeOff className="h-3 w-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2 rounded-lg text-[#195de6] hover:bg-[#195de6]/10"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {editingStaff ? 'New Password (leave blank to keep current)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      required={!editingStaff}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-[#195de6] rounded"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                      Active Account
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions (only for staff role) */}
              {formData.role === 'staff' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Permissions</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, permissions: defaultPermissions }))}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Use Default
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const allEnabled = Object.keys(defaultPermissions).reduce((acc, key) => ({ ...acc, [key]: true }), {});
                          setFormData(prev => ({ ...prev, permissions: allEnabled }));
                        }}
                        className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        Enable All
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const allDisabled = Object.keys(defaultPermissions).reduce((acc, key) => ({ ...acc, [key]: false }), {});
                          setFormData(prev => ({ ...prev, permissions: allDisabled }));
                        }}
                        className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>

                  {permissionGroups.map((group) => (
                    <div key={group.title} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{group.title}</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {group.permissions.map((perm) => (
                          <label
                            key={perm}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions[perm] || false}
                              onChange={() => togglePermission(perm)}
                              className="w-4 h-4 text-[#195de6] rounded"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                              {perm.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#195de6] text-white font-bold hover:bg-[#1e40af] transition-colors"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  {editingStaff ? 'Update Staff' : 'Create Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
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

export default Staff;
