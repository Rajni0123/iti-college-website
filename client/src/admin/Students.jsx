import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, User, Phone, Mail, GraduationCap, Calendar, FileText, Printer } from 'lucide-react';
import { getAllStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import toast from 'react-hot-toast';
import { generateAdmissionFormHTML } from './AdmissionFormPrintTemplate';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    mobile: '',
    email: '',
    trade: '',
    enrollment_number: '',
    admission_date: new Date().toISOString().split('T')[0],
    qualification: '',
    category: '',
    address: '',
    photo: '',
    status: 'Active',
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    uidai_number: '',
    village_town_city: '',
    nearby: '',
    police_station: '',
    post_office: '',
    district: '',
    pincode: '',
    block: '',
    state: '',
    pwd_category: '',
    pwd_claim: 'No',
    class_10th_school: '',
    class_10th_marks_obtained: '',
    class_10th_total_marks: '',
    class_10th_percentage: '',
    class_10th_subject: '',
    class_12th_school: '',
    class_12th_marks_obtained: '',
    class_12th_total_marks: '',
    class_12th_percentage: '',
    class_12th_subject: '',
    session: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    shift: '',
    mis_iti_code: 'PR10001156',
    declaration_agreed: false
  });

  useEffect(() => {
    fetchStudents();
  }, [filterTrade, filterStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterTrade) params.trade = filterTrade;
      if (filterStatus) params.status = filterStatus;
      
      const response = await getAllStudents(params);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.student_name || !formData.mobile || !formData.trade) {
      toast.error('Student name, mobile, and trade are required');
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
        toast.success('Student updated successfully');
      } else {
        await createStudent(formData);
        toast.success('Student created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_name: student.student_name || '',
      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      mobile: student.mobile || '',
      email: student.email || '',
      trade: student.trade || '',
      enrollment_number: student.enrollment_number || '',
      admission_date: student.admission_date || new Date().toISOString().split('T')[0],
      qualification: student.qualification || '',
      category: student.category || '',
      address: student.address || '',
      photo: student.photo || '',
      status: student.status || 'Active',
      academic_year: student.academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      uidai_number: student.uidai_number || '',
      village_town_city: student.village_town_city || '',
      nearby: student.nearby || '',
      police_station: student.police_station || '',
      post_office: student.post_office || '',
      district: student.district || '',
      pincode: student.pincode || '',
      block: student.block || '',
      state: student.state || '',
      pwd_category: student.pwd_category || '',
      pwd_claim: student.pwd_claim || 'No',
      class_10th_school: student.class_10th_school || '',
      class_10th_marks_obtained: student.class_10th_marks_obtained || '',
      class_10th_total_marks: student.class_10th_total_marks || '',
      class_10th_percentage: student.class_10th_percentage || '',
      class_10th_subject: student.class_10th_subject || '',
      class_12th_school: student.class_12th_school || '',
      class_12th_marks_obtained: student.class_12th_marks_obtained || '',
      class_12th_total_marks: student.class_12th_total_marks || '',
      class_12th_percentage: student.class_12th_percentage || '',
      class_12th_subject: student.class_12th_subject || '',
      session: student.session || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      shift: student.shift || '',
      mis_iti_code: student.mis_iti_code || 'PR10001156',
      declaration_agreed: student.declaration_agreed || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    try {
      await deleteStudent(id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      father_name: '',
      mother_name: '',
      mobile: '',
      email: '',
      trade: '',
      enrollment_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      qualification: '',
      category: '',
      address: '',
      photo: '',
      status: 'Active',
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      uidai_number: '',
      village_town_city: '',
      nearby: '',
      police_station: '',
      post_office: '',
      district: '',
      pincode: '',
      block: '',
      state: '',
      pwd_category: '',
      pwd_claim: 'No',
      class_10th_school: '',
      class_10th_marks_obtained: '',
      class_10th_total_marks: '',
      class_10th_percentage: '',
      class_10th_subject: '',
      class_12th_school: '',
      class_12th_marks_obtained: '',
      class_12th_total_marks: '',
      class_12th_percentage: '',
      class_12th_subject: '',
      session: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      shift: '',
      mis_iti_code: 'PR10001156',
      declaration_agreed: false
    });
    setEditingStudent(null);
  };

  const handlePrintAdmissionForm = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateAdmissionFormHTML(student));
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const filteredStudents = students.filter(student => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        student.student_name?.toLowerCase().includes(query) ||
        student.mobile?.toLowerCase().includes(query) ||
        student.enrollment_number?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const trades = ['Electrician', 'Fitter'];
  const categories = ['General', 'SC', 'ST', 'OBC', 'EWS'];
  const statuses = ['Active', 'Inactive', 'Graduated', 'Discontinued'];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Student Management</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">Manage student records and information</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#195de6] text-white text-sm font-bold shadow-lg hover:bg-[#1e40af] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, enrollment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm"
            />
          </div>
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm"
          >
            <option value="">All Trades</option>
            {trades.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#195de6] mx-auto mb-4"></div>
              <p className="text-slate-500">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Trade</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Enrollment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.student_name}</p>
                          {student.father_name && (
                            <p className="text-xs text-slate-500">S/O {student.father_name}</p>
                          )}
                          {student.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                              {student.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {student.mobile && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {student.mobile}
                            </p>
                          )}
                          {student.email && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{student.trade}</span>
                      </td>
                      <td className="px-6 py-4">
                        {student.enrollment_number ? (
                          <span className="text-sm font-mono text-[#195de6]">{student.enrollment_number}</span>
                        ) : (
                          <span className="text-xs text-slate-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          student.status === 'Active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : student.status === 'Graduated'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePrintAdmissionForm(student)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                            title="Print Admission Form"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 rounded-lg text-[#195de6] hover:bg-[#195de6]/10"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Father's Name</label>
                    <input
                      type="text"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mother's Name</label>
                    <input
                      type="text"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm resize-none"
                    rows="2"
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trade *</label>
                    <select
                      required
                      value={formData.trade}
                      onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    >
                      <option value="">Select Trade</option>
                      {trades.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Enrollment Number</label>
                    <input
                      type="text"
                      value={formData.enrollment_number}
                      onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admission Date</label>
                    <input
                      type="date"
                      value={formData.admission_date}
                      onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                      placeholder="e.g., 10th Pass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Academic Year</label>
                    <input
                      type="text"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                      placeholder="e.g., 2024-2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Photo URL</label>
                  <input
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#195de6] text-white font-bold hover:bg-[#1e40af] transition-colors"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  {editingStudent ? 'Update Student' : 'Create Student'}
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

export default Students;
