import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Eye, 
  Download,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  Printer,
  Edit
} from 'lucide-react';
import { getAdmissions, updateAdmissionStatus, updateAdmission, downloadDocument, createManualAdmission } from '../services/api';
import toast from 'react-hot-toast';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    father_name: '',
    mobile: '',
    email: '',
    trade: '',
    qualification: '',
    category: 'GEN',
    status: 'Pending',
    has_photo: false,
    has_aadhaar: false,
    has_marksheet: false
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [manualFormData, setManualFormData] = useState({
    name: '',
    father_name: '',
    mobile: '',
    email: '',
    trade: '',
    qualification: '',
    category: 'GEN',
    status: 'Pending'
  });

  useEffect(() => {
    fetchAdmissions();
  }, [currentPage, statusFilter, tradeFilter]);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      if (tradeFilter !== 'all') {
        filters.trade = tradeFilter;
      }
      
      const response = await getAdmissions(currentPage, filters);
      setAdmissions(response.data.admissions || []);
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to fetch admissions');
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const trades = ['Electrician', 'Fitter', 'Welder', 'Mechanic'];
  const categories = ['GEN', 'OBC', 'SC', 'ST'];
  const statuses = ['Pending', 'Approved', 'Rejected'];

  const handleViewDetails = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const handleEdit = (admission) => {
    setSelectedAdmission(admission);
    setEditFormData({
      name: admission.name || '',
      father_name: admission.father_name || '',
      mobile: admission.mobile || '',
      email: admission.email || '',
      trade: admission.trade || '',
      qualification: admission.qualification || '',
      category: admission.category || 'GEN',
      status: admission.status ? admission.status.charAt(0).toUpperCase() + admission.status.slice(1) : 'Pending',
      has_photo: admission.documents?.photo ? true : false,
      has_aadhaar: admission.documents?.aadhaar ? true : false,
      has_marksheet: admission.documents?.marksheet ? true : false
    });
    setShowModal(false);
    setShowEditModal(true);
  };

  const handleUpdateAdmission = async (e) => {
    e.preventDefault();
    try {
      await updateAdmission(selectedAdmission.dbId, editFormData);
      toast.success('Admission updated successfully');
      fetchAdmissions();
      setShowEditModal(false);
      setSelectedAdmission(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update admission');
    }
  };

  const handleStatusUpdate = async (dbId, newStatus) => {
    try {
      await updateAdmissionStatus(dbId, newStatus);
      toast.success('Status updated successfully');
      fetchAdmissions();
      if (showModal) {
        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDownloadDocument = async (filename) => {
    try {
      const response = await downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document downloaded');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!manualFormData.name || !manualFormData.father_name || !manualFormData.mobile || 
        !manualFormData.trade || !manualFormData.qualification || !manualFormData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate mobile number
    if (manualFormData.mobile.length !== 10 || !/^\d+$/.test(manualFormData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      console.log('Submitting manual admission:', manualFormData);
      const response = await createManualAdmission(manualFormData);
      console.log('Response:', response);
      toast.success(response.data?.message || 'Admission created successfully');
      setShowManualEntryModal(false);
      setManualFormData({
        name: '',
        father_name: '',
        mobile: '',
        email: '',
        trade: '',
        qualification: '',
        category: 'GEN',
        status: 'Pending'
      });
      fetchAdmissions();
    } catch (error) {
      console.error('Error creating admission:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create admission';
      toast.error(errorMessage);
    }
  };

  const handleExportData = () => {
    // Fetch all admissions without pagination for export
    const exportData = async () => {
      try {
        const filters = {};
        if (statusFilter !== 'all') {
          filters.status = statusFilter;
        }
        if (tradeFilter !== 'all') {
          filters.trade = tradeFilter;
        }
        
        // Get all data (set a high limit)
        const response = await getAdmissions(1, { ...filters, limit: 10000 });
        const allAdmissions = response.data.admissions || [];

        // Convert to CSV
        const headers = ['Application ID', 'Name', 'Father Name', 'Mobile', 'Email', 'Trade', 'Qualification', 'Category', 'Status', 'Date Submitted'];
        const csvRows = [
          headers.join(','),
          ...allAdmissions.map(admission => [
            admission.id,
            `"${admission.name}"`,
            `"${admission.father_name}"`,
            admission.mobile,
            admission.email || '',
            admission.trade,
            `"${admission.qualification}"`,
            admission.category,
            admission.status,
            admission.dateSubmitted
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `admissions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Data exported successfully');
      } catch (error) {
        toast.error('Failed to export data');
      }
    };

    exportData();
  };

  const filteredAdmissions = admissions.filter(admission => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      admission.name.toLowerCase().includes(search) ||
      admission.id.toLowerCase().includes(search) ||
      admission.mobile.includes(search) ||
      admission.email?.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const getInitialsColor = (color) => {
    const colors = {
      indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
      rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400',
      amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Admission Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Review and process student applications for the 2024-25 session.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
            <button 
              onClick={() => setShowManualEntryModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold shadow-md hover:bg-[#1e40af] transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Manual Entry
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Applications</p>
              <UserPlus className="h-5 w-5 text-[#195de6]" />
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{total}</p>
            <p className="text-xs text-green-600 mt-2 font-medium">All time applications</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Review</p>
              <span className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                {admissions.filter(a => a.status === 'pending').length}
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
              {admissions.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">Requires attention</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Approved</p>
              <span className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
              {admissions.filter(a => a.status === 'approved').length}
            </p>
            <p className="text-xs text-green-600 mt-2 font-medium">Ready for enrollment</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rejected</p>
              <span className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                ✕
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
              {admissions.filter(a => a.status === 'rejected').length}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Closed applications</p>
          </div>
        </div>

        {/* Table Content Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          {/* Search and Filters Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <label className="relative flex items-center">
                <Search className="absolute left-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                  placeholder="Search students by name or ID..."
                />
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={tradeFilter}
                onChange={(e) => {
                  setTradeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border-none cursor-pointer"
              >
                <option value="all">Trade: All</option>
                <option value="Electrician">Electrician</option>
                <option value="Fitter">Fitter</option>
                <option value="Welder">Welder</option>
                <option value="Mechanic">Mechanic</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-bold border-none cursor-pointer ${
                  statusFilter !== 'all'
                    ? 'bg-[#195de6]/10 text-[#195de6] border border-[#195de6]/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <option value="all">Status: All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Trade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Loading admissions...
                    </td>
                  </tr>
                ) : filteredAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No admissions found
                    </td>
                  </tr>
                ) : (
                  filteredAdmissions.map((admission) => (
                    <tr key={admission.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-200">
                        {admission.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${getInitialsColor(admission.color)}`}>
                            {admission.initials}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {admission.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {admission.trade}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(admission.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {admission.dateSubmitted}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetails(admission)}
                            className="p-1.5 rounded-lg text-[#195de6] hover:bg-[#195de6]/10 transition-colors" 
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing {filteredAdmissions.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} to {Math.min(currentPage * 10, total)} of {total} applications
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-xs font-bold ${
                      currentPage === pageNum
                        ? 'bg-[#195de6] text-white border-[#195de6]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Application ID</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedAdmission.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
                    {getStatusBadge(selectedAdmission.status)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Father/Guardian Name</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.father_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mobile</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedAdmission.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedAdmission.email || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Academic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trade</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.trade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Qualification</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.qualification}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Date Submitted</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAdmission.dateSubmitted}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Documents</h4>
                <div className="space-y-2">
                  <div className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                    selectedAdmission.documents?.photo 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedAdmission.documents?.photo ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Photo</span>
                    </div>
                    {selectedAdmission.documents?.photo ? (
                      <button
                        onClick={() => handleDownloadDocument(selectedAdmission.documents.photo)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#195de6] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">Not Available</span>
                    )}
                  </div>
                  
                  <div className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                    selectedAdmission.documents?.aadhaar 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedAdmission.documents?.aadhaar ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Aadhaar Card</span>
                    </div>
                    {selectedAdmission.documents?.aadhaar ? (
                      <button
                        onClick={() => handleDownloadDocument(selectedAdmission.documents.aadhaar)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#195de6] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">Not Available</span>
                    )}
                  </div>
                  
                  <div className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                    selectedAdmission.documents?.marksheet 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedAdmission.documents?.marksheet ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Marksheet</span>
                    </div>
                    {selectedAdmission.documents?.marksheet ? (
                      <button
                        onClick={() => handleDownloadDocument(selectedAdmission.documents.marksheet)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#195de6] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">Not Available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleEdit(selectedAdmission)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white hover:bg-[#1e40af] transition-colors font-bold"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Application
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Update Status</h4>
                <div className="flex gap-3">
                  {selectedAdmission.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedAdmission.dbId, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                  )}
                  {selectedAdmission.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedAdmission.dbId, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  )}
                  {selectedAdmission.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedAdmission.dbId, 'pending')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      <Clock className="h-4 w-4" />
                      Set Pending
                    </button>
                  )}
                </div>
              </div>

              {/* Print Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Admission Form - ${selectedAdmission.id}</title>
                          <style>
                            @media print { 
                              @page { margin: 1.5cm; size: A4; } 
                              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; } 
                            }
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; line-height: 1.6; }
                            .header { text-align: center; border-bottom: 3px solid #195de6; padding-bottom: 25px; margin-bottom: 35px; }
                            .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: bold; color: #195de6; letter-spacing: 1px; }
                            .header .address { margin: 5px 0; font-size: 13px; color: #555; line-height: 1.8; }
                            .header .contact-info { margin: 5px 0; font-size: 13px; color: #555; }
                            .header .form-title { margin: 15px 0 8px 0; font-size: 20px; font-weight: bold; color: #333; }
                            .header .app-id { margin: 5px 0; font-size: 15px; font-weight: bold; color: #195de6; }
                            .form-section { margin-bottom: 30px; page-break-inside: avoid; }
                            .form-section h3 { background: linear-gradient(to right, #195de6, #1e40af); color: white; padding: 12px 15px; margin: 0 0 20px 0; border-radius: 5px; font-size: 16px; font-weight: bold; }
                            .form-row { display: flex; margin-bottom: 18px; gap: 20px; }
                            .form-field { flex: 1; }
                            .form-label { font-weight: 600; color: #333; margin-bottom: 8px; display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                            .form-value { padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; min-height: 25px; font-size: 14px; color: #212529; }
                            .doc-status { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
                            .doc-yes { background: #d4edda; color: #155724; }
                            .doc-no { background: #f8d7da; color: #721c24; }
                            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
                            .signature-box { width: 45%; text-align: center; }
                            .signature-line { border-top: 2px solid #000; margin-top: 60px; padding-top: 8px; font-weight: 600; }
                            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>Maner Pvt ITI</h1>
                            <p class="address">Maner MAHINAWAN, NEAR VISHWAKARMA MANDIR, MANER, PATNA - 801108</p>
                            <p class="contact-info">Contact: 9155401839 | Email: MANERPVTITI@GMAIL.COM</p>
                            <p class="form-title">Admission Application Form</p>
                            <p class="app-id">Application ID: ${selectedAdmission.id}</p>
                          </div>
                          <div class="form-section">
                            <h3>Personal Information</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Full Name:</span>
                                <div class="form-value">${selectedAdmission.name}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Father/Guardian Name:</span>
                                <div class="form-value">${selectedAdmission.father_name}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Mobile Number:</span>
                                <div class="form-value">${selectedAdmission.mobile}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Email:</span>
                                <div class="form-value">${selectedAdmission.email || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Academic Information</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Trade Applied:</span>
                                <div class="form-value">${selectedAdmission.trade}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Qualification:</span>
                                <div class="form-value">${selectedAdmission.qualification}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Category:</span>
                                <div class="form-value">${selectedAdmission.category}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Status:</span>
                                <div class="form-value">${selectedAdmission.status.toUpperCase()}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Date Submitted:</span>
                                <div class="form-value">${selectedAdmission.dateSubmitted}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Documents Status</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Photo:</span>
                                <div class="form-value">
                                  <span class="doc-status ${selectedAdmission.documents?.photo ? 'doc-yes' : 'doc-no'}">
                                    ${selectedAdmission.documents?.photo ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Aadhaar Card:</span>
                                <div class="form-value">
                                  <span class="doc-status ${selectedAdmission.documents?.aadhaar ? 'doc-yes' : 'doc-no'}">
                                    ${selectedAdmission.documents?.aadhaar ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Marksheet:</span>
                                <div class="form-value">
                                  <span class="doc-status ${selectedAdmission.documents?.marksheet ? 'doc-yes' : 'doc-no'}">
                                    ${selectedAdmission.documents?.marksheet ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="signature-section">
                            <div class="signature-box">
                              <div class="signature-line">Applicant Signature</div>
                            </div>
                            <div class="signature-box">
                              <div class="signature-line">Authorized Signatory</div>
                            </div>
                          </div>
                          <div class="footer">
                            <p>This is a computer-generated document. No signature required.</p>
                            <p>Generated on: ${new Date().toLocaleString()}</p>
                          </div>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    setTimeout(() => printWindow.print(), 250);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white hover:bg-[#1e40af] transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print Admission Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admission Modal */}
      {showEditModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Admission Application</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAdmission(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmission} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Father/Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.father_name}
                      onChange={(e) => setEditFormData({ ...editFormData, father_name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="Enter father/guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={editFormData.mobile}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="10 digit mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Academic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Trade <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={editFormData.trade}
                      onChange={(e) => setEditFormData({ ...editFormData, trade: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      <option value="">Select Trade</option>
                      {trades.map((trade) => (
                        <option key={trade} value={trade}>
                          {trade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.qualification}
                      onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="e.g., 10th Pass"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Documents Status</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_photo ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Photo</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_photo ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_photo"
                          checked={editFormData.has_photo === true}
                          onChange={() => setEditFormData({ ...editFormData, has_photo: true })}
                          className="hidden"
                        />
                        <CheckCircle className="h-3 w-3" />
                        YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_photo ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_photo"
                          checked={editFormData.has_photo === false}
                          onChange={() => setEditFormData({ ...editFormData, has_photo: false })}
                          className="hidden"
                        />
                        <XCircle className="h-3 w-3" />
                        NO
                      </label>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_aadhaar ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Aadhaar Card</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_aadhaar ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_aadhaar"
                          checked={editFormData.has_aadhaar === true}
                          onChange={() => setEditFormData({ ...editFormData, has_aadhaar: true })}
                          className="hidden"
                        />
                        <CheckCircle className="h-3 w-3" />
                        YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_aadhaar ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_aadhaar"
                          checked={editFormData.has_aadhaar === false}
                          onChange={() => setEditFormData({ ...editFormData, has_aadhaar: false })}
                          className="hidden"
                        />
                        <XCircle className="h-3 w-3" />
                        NO
                      </label>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_marksheet ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Marksheet</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_marksheet ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_marksheet"
                          checked={editFormData.has_marksheet === true}
                          onChange={() => setEditFormData({ ...editFormData, has_marksheet: true })}
                          className="hidden"
                        />
                        <CheckCircle className="h-3 w-3" />
                        YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_marksheet ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input
                          type="radio"
                          name="has_marksheet"
                          checked={editFormData.has_marksheet === false}
                          onChange={() => setEditFormData({ ...editFormData, has_marksheet: false })}
                          className="hidden"
                        />
                        <XCircle className="h-3 w-3" />
                        NO
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#195de6] text-white hover:bg-[#1e40af] transition-colors font-bold"
                >
                  <CheckCircle className="h-4 w-4" />
                  Update Admission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmission(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manual Admission Entry</h3>
              <button
                onClick={() => {
                  setShowManualEntryModal(false);
                  setManualFormData({
                    name: '',
                    father_name: '',
                    mobile: '',
                    email: '',
                    trade: '',
                    qualification: '',
                    category: 'GEN',
                    status: 'Pending'
                  });
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleManualEntry} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualFormData.name}
                      onChange={(e) => setManualFormData({ ...manualFormData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Father/Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualFormData.father_name}
                      onChange={(e) => setManualFormData({ ...manualFormData, father_name: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="Enter father/guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={manualFormData.mobile}
                      onChange={(e) => setManualFormData({ ...manualFormData, mobile: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="10 digit mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={manualFormData.email}
                      onChange={(e) => setManualFormData({ ...manualFormData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Academic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Trade <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={manualFormData.trade}
                      onChange={(e) => setManualFormData({ ...manualFormData, trade: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      <option value="">Select Trade</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Fitter">Fitter</option>
                      <option value="Welder">Welder</option>
                      <option value="Mechanic">Mechanic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualFormData.qualification}
                      onChange={(e) => setManualFormData({ ...manualFormData, qualification: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="e.g., 10th Pass"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={manualFormData.category}
                      onChange={(e) => setManualFormData({ ...manualFormData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      <option value="GEN">GEN</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Status
                    </label>
                    <select
                      value={manualFormData.status}
                      onChange={(e) => setManualFormData({ ...manualFormData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 text-slate-900 dark:text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#195de6] text-white text-sm font-bold hover:bg-[#1e40af] transition-colors"
                >
                  Create Admission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntryModal(false);
                    setManualFormData({
                      name: '',
                      father_name: '',
                      mobile: '',
                      email: '',
                      trade: '',
                      qualification: '',
                      category: 'GEN',
                      status: 'Pending'
                    });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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

export default Admissions;
