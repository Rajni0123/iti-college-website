import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, X, Eye, EyeOff, User, ArrowUp, ArrowDown } from 'lucide-react';
import { getAllFacultyAdmin, createFaculty, updateFaculty, deleteFaculty } from '../services/api';
import toast from 'react-hot-toast';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    image: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    is_principal: 0,
    display_order: 0,
    is_active: 1
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await getAllFacultyAdmin();
      if (response.data.success) {
        setFaculty(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error('Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      department: '',
      qualification: '',
      experience: '',
      image: '',
      email: '',
      phone: '',
      bio: '',
      specialization: '',
      is_principal: 0,
      display_order: 0,
      is_active: 1
    });
    setEditingFaculty(null);
  };

  const handleEdit = (member) => {
    setEditingFaculty(member);
    setFormData({
      name: member.name || '',
      designation: member.designation || '',
      department: member.department || '',
      qualification: member.qualification || '',
      experience: member.experience || '',
      image: member.image || '',
      email: member.email || '',
      phone: member.phone || '',
      bio: member.bio || '',
      specialization: member.specialization || '',
      is_principal: member.is_principal || 0,
      display_order: member.display_order || 0,
      is_active: member.is_active !== undefined ? member.is_active : 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, formData);
        toast.success('Faculty updated successfully');
      } else {
        await createFaculty(formData);
        toast.success('Faculty created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchFaculty();
    } catch (error) {
      console.error('Error saving faculty:', error);
      toast.error(error.response?.data?.message || 'Failed to save faculty');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) {
      return;
    }
    try {
      await deleteFaculty(id);
      toast.success('Faculty deleted successfully');
      fetchFaculty();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  const handleMoveOrder = async (member, direction) => {
    const currentIndex = faculty.findIndex(f => f.id === member.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === faculty.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetMember = faculty[newIndex];

    try {
      await Promise.all([
        updateFaculty(member.id, { ...member, display_order: targetMember.display_order }),
        updateFaculty(targetMember.id, { ...targetMember, display_order: member.display_order })
      ]);
      fetchFaculty();
      toast.success('Display order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const departments = ['Electrician', 'Fitter', 'Administration', 'Computer Science', 'Electronics', 'Automobile', 'Other'];

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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0e121b] dark:text-white mb-2">Faculty Management</h1>
            <p className="text-[#4e6797] dark:text-gray-400">Manage faculty members and staff</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#195de6] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-colors shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Faculty Member
          </button>
        </div>

        {/* Faculty List */}
        <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Faculty</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Qualification</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#0e121b] dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {faculty.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(member, 'up')}
                          disabled={index === 0}
                          className="p-1 text-[#195de6] hover:bg-[#195de6]/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium text-[#4e6797] dark:text-gray-400 w-6 text-center">
                          {member.display_order}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(member, 'down')}
                          disabled={index === faculty.length - 1}
                          className="p-1 text-[#195de6] hover:bg-[#195de6]/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image || 'https://via.placeholder.com/100'}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#0e121b] dark:text-white">{member.name}</p>
                            {member.is_principal === 1 && (
                              <span className="bg-[#195de6]/10 text-[#195de6] text-xs font-bold px-2 py-0.5 rounded-full">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#4e6797] dark:text-gray-400">{member.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#195de6] rounded-full text-sm font-medium">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4e6797] dark:text-gray-400">
                      {member.qualification || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {member.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                          <Eye className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="px-4 py-2 text-sm font-medium text-[#195de6] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1c222d] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-[#1c222d] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0e121b] dark:text-white">
                  {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0e121b] dark:text-white">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="e.g., Dr. Rajesh Kumar"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Designation *
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="e.g., Senior Instructor"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Department *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="e.g., B.Tech in Electrical Eng."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="e.g., 12+ Years Experience"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="e.g., Electrical Systems, Industrial Automation"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0e121b] dark:text-white">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="email@iticollege.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        placeholder="+91 123 456 7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0e121b] dark:text-white">Additional Details</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                      Bio / Quote
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6] resize-none"
                      rows="3"
                      placeholder="Brief bio or inspirational quote for the principal spotlight"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0e121b] dark:text-white">Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#0e121b] dark:text-white">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#195de6]"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-8">
                      <input
                        type="checkbox"
                        id="is_principal"
                        checked={formData.is_principal === 1}
                        onChange={(e) => setFormData({ ...formData, is_principal: e.target.checked ? 1 : 0 })}
                        className="w-5 h-5 text-[#195de6] rounded focus:ring-2 focus:ring-[#195de6]"
                      />
                      <label htmlFor="is_principal" className="text-sm font-semibold text-[#0e121b] dark:text-white cursor-pointer">
                        Mark as Principal
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-8">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active === 1}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                        className="w-5 h-5 text-[#195de6] rounded focus:ring-2 focus:ring-[#195de6]"
                      />
                      <label htmlFor="is_active" className="text-sm font-semibold text-[#0e121b] dark:text-white cursor-pointer">
                        Active/Visible
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#195de6] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-colors shadow-lg"
                  >
                    <Save className="h-5 w-5" />
                    {editingFaculty ? 'Update Faculty' : 'Create Faculty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const departments = ['Electrician', 'Fitter', 'Administration', 'Computer Science', 'Electronics', 'Automobile', 'Other'];

export default FacultyManagement;
