import { useState, useEffect, useRef } from 'react';
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

const defaultManualFormData = {
  name: '', father_name: '', mother_name: '', mobile: '', email: '',
  dob: '', gender: '', category: 'GEN', uidai_number: '',
  village_town_city: '', nearby: '', police_station: '', post_office: '',
  district: '', pincode: '', block: '', state: '',
  pwd_category: '', pwd_claim: 'No',
  trade: '', qualification: '', session: '', shift: '',
  class_10th_school: '', class_10th_marks_obtained: '', class_10th_total_marks: '',
  class_10th_percentage: '', class_10th_subject: '',
  class_12th_school: '', class_12th_marks_obtained: '', class_12th_total_marks: '',
  class_12th_percentage: '', class_12th_subject: '',
  student_credit_card: 'No', student_credit_card_bank: '', student_credit_card_account: '',
  registration_type: 'Regular', status: 'Pending'
};

const defaultEditFormData = {
  name: '', father_name: '', mother_name: '', mobile: '', email: '',
  dob: '', gender: '', category: 'GEN', uidai_number: '',
  village_town_city: '', nearby: '', police_station: '', post_office: '',
  district: '', pincode: '', block: '', state: '',
  pwd_category: '', pwd_claim: 'No',
  trade: '', qualification: '', session: '', shift: '',
  class_10th_school: '', class_10th_marks_obtained: '', class_10th_total_marks: '',
  class_10th_percentage: '', class_10th_subject: '',
  class_12th_school: '', class_12th_marks_obtained: '', class_12th_total_marks: '',
  class_12th_percentage: '', class_12th_subject: '',
  student_credit_card: 'No', student_credit_card_bank: '', student_credit_card_account: '',
  registration_type: 'Regular', status: 'Pending',
  has_photo: false, has_aadhaar: false, has_marksheet: false
};

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
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [sessions, setSessions] = useState([]);
  const exportDropdownRef = useRef(null);
  const [editFormData, setEditFormData] = useState({ ...defaultEditFormData });
  const [statusFilter, setStatusFilter] = useState('all');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [manualFormData, setManualFormData] = useState({ ...defaultManualFormData });

  useEffect(() => {
    fetchAdmissions();
  }, [currentPage, statusFilter, tradeFilter]);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSessions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await fetch(`${apiUrl}/sessions/active`);
      const data = await response.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

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
  const stateOptions = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];

  const handleViewDetails = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const handleEdit = (admission) => {
    setSelectedAdmission(admission);
    // Parse student_credit_card_details if it exists
    let sccBank = '';
    let sccAccount = '';
    if (admission.student_credit_card_details) {
      try {
        const sccDetails = typeof admission.student_credit_card_details === 'string'
          ? JSON.parse(admission.student_credit_card_details)
          : admission.student_credit_card_details;
        sccBank = sccDetails.bank_name || sccDetails.bank || '';
        sccAccount = sccDetails.account_number || sccDetails.account || '';
      } catch (e) { /* ignore parse errors */ }
    }

    setEditFormData({
      name: admission.name || '',
      father_name: admission.father_name || '',
      mother_name: admission.mother_name || '',
      mobile: admission.mobile || '',
      email: admission.email || '',
      dob: admission.dob || '',
      gender: admission.gender || '',
      category: admission.category || 'GEN',
      uidai_number: admission.uidai_number || '',
      village_town_city: admission.village_town_city || '',
      nearby: admission.nearby || '',
      police_station: admission.police_station || '',
      post_office: admission.post_office || '',
      district: admission.district || '',
      pincode: admission.pincode || '',
      block: admission.block || '',
      state: admission.state || '',
      pwd_category: admission.pwd_category || '',
      pwd_claim: admission.pwd_claim || 'No',
      trade: admission.trade || '',
      qualification: admission.qualification || '',
      session: admission.session || '',
      shift: admission.shift || '',
      class_10th_school: admission.class_10th_school || '',
      class_10th_marks_obtained: admission.class_10th_marks_obtained || '',
      class_10th_total_marks: admission.class_10th_total_marks || '',
      class_10th_percentage: admission.class_10th_percentage || '',
      class_10th_subject: admission.class_10th_subject || '',
      class_12th_school: admission.class_12th_school || '',
      class_12th_marks_obtained: admission.class_12th_marks_obtained || '',
      class_12th_total_marks: admission.class_12th_total_marks || '',
      class_12th_percentage: admission.class_12th_percentage || '',
      class_12th_subject: admission.class_12th_subject || '',
      student_credit_card: admission.student_credit_card || 'No',
      student_credit_card_bank: sccBank,
      student_credit_card_account: sccAccount,
      registration_type: admission.registration_type || 'Regular',
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
      const submitData = { ...editFormData };
      // Pack student_credit_card_details as JSON
      if (submitData.student_credit_card === 'Yes') {
        submitData.student_credit_card_details = JSON.stringify({
          bank_name: submitData.student_credit_card_bank,
          account_number: submitData.student_credit_card_account
        });
      }
      delete submitData.student_credit_card_bank;
      delete submitData.student_credit_card_account;

      await updateAdmission(selectedAdmission.dbId, submitData);
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
      const submitData = { ...manualFormData };
      // Pack student_credit_card_details as JSON
      if (submitData.student_credit_card === 'Yes') {
        submitData.student_credit_card_details = JSON.stringify({
          bank_name: submitData.student_credit_card_bank,
          account_number: submitData.student_credit_card_account
        });
      }
      delete submitData.student_credit_card_bank;
      delete submitData.student_credit_card_account;
      // Include registration_type
      submitData.registration_type = submitData.registration_type || 'Regular';

      console.log('Submitting manual admission:', submitData);
      const response = await createManualAdmission(submitData);
      console.log('Response:', response);
      toast.success(response.data?.message || 'Admission created successfully');
      setShowManualEntryModal(false);
      setManualFormData({ ...defaultManualFormData });
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

  const csvEscape = (val) => {
    const str = String(val == null ? '' : val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportData = (filterType) => {
    setShowExportDropdown(false);
    const exportData = async () => {
      try {
        const filters = {};
        if (statusFilter !== 'all') filters.status = statusFilter;
        if (tradeFilter !== 'all') filters.trade = tradeFilter;

        const response = await getAdmissions(1, { ...filters, limit: 10000 });
        let allAdmissions = response.data.admissions || [];

        // Apply registration_type filter
        if (filterType === 'regular') {
          allAdmissions = allAdmissions.filter(a => (a.registration_type || 'Regular') === 'Regular');
        } else if (filterType === 'student_credit_card') {
          allAdmissions = allAdmissions.filter(a => a.student_credit_card === 'Yes');
        }

        const headers = [
          'Application ID', 'Name', 'Father Name', 'Mother Name', 'Mobile', 'Email',
          'DOB', 'Gender', 'UIDAI Number', 'Category', 'Trade', 'Qualification', 'Session', 'Shift',
          'Village/Town/City', 'Nearby', 'Police Station', 'Post Office', 'Block', 'District', 'State', 'Pincode',
          'PWD Claim', 'PWD Category',
          '10th School', '10th Marks', '10th Total', '10th Percentage', '10th Subject',
          '12th School', '12th Marks', '12th Total', '12th Percentage', '12th Subject',
          'Student Credit Card', 'Registration Type', 'Status', 'Date Submitted'
        ];

        const csvRows = [
          headers.join(','),
          ...allAdmissions.map(a => [
            csvEscape(a.id),
            csvEscape(a.name),
            csvEscape(a.father_name),
            csvEscape(a.mother_name),
            csvEscape(a.mobile),
            csvEscape(a.email),
            csvEscape(a.dob),
            csvEscape(a.gender),
            csvEscape(a.uidai_number),
            csvEscape(a.category),
            csvEscape(a.trade),
            csvEscape(a.qualification),
            csvEscape(a.session),
            csvEscape(a.shift),
            csvEscape(a.village_town_city),
            csvEscape(a.nearby),
            csvEscape(a.police_station),
            csvEscape(a.post_office),
            csvEscape(a.block),
            csvEscape(a.district),
            csvEscape(a.state),
            csvEscape(a.pincode),
            csvEscape(a.pwd_claim),
            csvEscape(a.pwd_category),
            csvEscape(a.class_10th_school),
            csvEscape(a.class_10th_marks_obtained),
            csvEscape(a.class_10th_total_marks),
            csvEscape(a.class_10th_percentage),
            csvEscape(a.class_10th_subject),
            csvEscape(a.class_12th_school),
            csvEscape(a.class_12th_marks_obtained),
            csvEscape(a.class_12th_total_marks),
            csvEscape(a.class_12th_percentage),
            csvEscape(a.class_12th_subject),
            csvEscape(a.student_credit_card),
            csvEscape(a.registration_type),
            csvEscape(a.status),
            csvEscape(a.dateSubmitted)
          ].join(','))
        ];

        const suffix = filterType === 'regular' ? '_regular' : filterType === 'student_credit_card' ? '_scc' : '';
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `admissions${suffix}_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Auto-calculate percentage helper
  const calcPercentage = (marks, total) => {
    const m = parseFloat(marks);
    const t = parseFloat(total);
    if (t > 0 && !isNaN(m)) return ((m / t) * 100).toFixed(2);
    return '';
  };

  // Parse student_credit_card_details from selected admission for display
  const parseSccDetails = (admission) => {
    if (!admission?.student_credit_card_details) return { bank: '', account: '' };
    try {
      const d = typeof admission.student_credit_card_details === 'string'
        ? JSON.parse(admission.student_credit_card_details)
        : admission.student_credit_card_details;
      return { bank: d.bank_name || d.bank || '', account: d.account_number || d.account || '' };
    } catch (e) { return { bank: '', account: '' }; }
  };

  // Shared input class
  const inputCls = "w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#195de6]/20 placeholder:text-slate-400 text-slate-900 dark:text-white";
  const labelCls = "block text-xs text-slate-500 dark:text-slate-400 mb-2";
  const sectionHeaderCls = "text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4";

  // Document row component for view modal
  const DocumentRow = ({ label, docKey }) => (
    <div className={`w-full flex items-center justify-between p-3 rounded-lg border ${
      selectedAdmission.documents?.[docKey]
        ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10'
        : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
    }`}>
      <div className="flex items-center gap-3">
        {selectedAdmission.documents?.[docKey] ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
      </div>
      {selectedAdmission.documents?.[docKey] ? (
        <button
          onClick={() => handleDownloadDocument(selectedAdmission.documents[docKey])}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#195de6] text-white text-xs font-bold hover:bg-[#1e40af] transition-colors"
        >
          <Download className="h-3 w-3" />
          Download
        </button>
      ) : (
        <span className="text-xs text-red-600 font-medium">Not Available</span>
      )}
    </div>
  );

  // Detail field component for view modal
  const DetailField = ({ label, value }) => (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-white">{value || 'N/A'}</p>
    </div>
  );

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
            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Data
                <ChevronDown className="h-4 w-4" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 py-1">
                  <button
                    onClick={() => handleExportData('all')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Export All Admissions (CSV)
                  </button>
                  <button
                    onClick={() => handleExportData('regular')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Export Regular Registration (CSV)
                  </button>
                  <button
                    onClick={() => handleExportData('student_credit_card')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Export Student Credit Card Registration (CSV)
                  </button>
                </div>
              )}
            </div>
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
                <h4 className={sectionHeaderCls}>Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Application ID" value={selectedAdmission.id} />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
                    {getStatusBadge(selectedAdmission.status)}
                  </div>
                  <DetailField label="Full Name" value={selectedAdmission.name} />
                  <DetailField label="Father/Guardian Name" value={selectedAdmission.father_name} />
                  <DetailField label="Mother Name" value={selectedAdmission.mother_name} />
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
                  <DetailField label="Date of Birth" value={selectedAdmission.dob} />
                  <DetailField label="Gender" value={selectedAdmission.gender} />
                  <DetailField label="UIDAI Number" value={selectedAdmission.uidai_number} />
                  <DetailField label="Category" value={selectedAdmission.category} />
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className={sectionHeaderCls}>Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Village/Town/City" value={selectedAdmission.village_town_city} />
                  <DetailField label="Nearby" value={selectedAdmission.nearby} />
                  <DetailField label="Police Station" value={selectedAdmission.police_station} />
                  <DetailField label="Post Office" value={selectedAdmission.post_office} />
                  <DetailField label="Block" value={selectedAdmission.block} />
                  <DetailField label="District" value={selectedAdmission.district} />
                  <DetailField label="State" value={selectedAdmission.state} />
                  <DetailField label="Pincode" value={selectedAdmission.pincode} />
                </div>
              </div>

              {/* Education - 10th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 10th</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="School" value={selectedAdmission.class_10th_school} />
                  <DetailField label="Marks Obtained" value={selectedAdmission.class_10th_marks_obtained} />
                  <DetailField label="Total Marks" value={selectedAdmission.class_10th_total_marks} />
                  <DetailField label="Percentage" value={selectedAdmission.class_10th_percentage ? `${selectedAdmission.class_10th_percentage}%` : 'N/A'} />
                  <DetailField label="Subject" value={selectedAdmission.class_10th_subject} />
                </div>
              </div>

              {/* Education - 12th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 12th</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="School" value={selectedAdmission.class_12th_school} />
                  <DetailField label="Marks Obtained" value={selectedAdmission.class_12th_marks_obtained} />
                  <DetailField label="Total Marks" value={selectedAdmission.class_12th_total_marks} />
                  <DetailField label="Percentage" value={selectedAdmission.class_12th_percentage ? `${selectedAdmission.class_12th_percentage}%` : 'N/A'} />
                  <DetailField label="Subject" value={selectedAdmission.class_12th_subject} />
                </div>
              </div>

              {/* Admission Info */}
              <div>
                <h4 className={sectionHeaderCls}>Admission Preferences</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Trade" value={selectedAdmission.trade} />
                  <DetailField label="Qualification" value={selectedAdmission.qualification} />
                  <DetailField label="Session" value={selectedAdmission.session} />
                  <DetailField label="Shift" value={selectedAdmission.shift} />
                  <DetailField label="Date Submitted" value={selectedAdmission.dateSubmitted} />
                </div>
              </div>

              {/* PWD Info */}
              <div>
                <h4 className={sectionHeaderCls}>PWD Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="PWD Claim" value={selectedAdmission.pwd_claim} />
                  {selectedAdmission.pwd_claim === 'Yes' && (
                    <DetailField label="PWD Category" value={selectedAdmission.pwd_category} />
                  )}
                </div>
              </div>

              {/* Student Credit Card */}
              <div>
                <h4 className={sectionHeaderCls}>Student Credit Card</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Student Credit Card" value={selectedAdmission.student_credit_card} />
                  {selectedAdmission.student_credit_card === 'Yes' && (() => {
                    const scc = parseSccDetails(selectedAdmission);
                    return (
                      <>
                        <DetailField label="Bank Name" value={scc.bank} />
                        <DetailField label="Account Number" value={scc.account} />
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Registration Type */}
              <div>
                <h4 className={sectionHeaderCls}>Registration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Registration Type" value={selectedAdmission.registration_type || 'Regular'} />
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className={sectionHeaderCls}>Documents</h4>
                <div className="space-y-2">
                  <DocumentRow label="Photo" docKey="photo" />
                  <DocumentRow label="Aadhaar Card" docKey="aadhaar" />
                  <DocumentRow label="Marksheet" docKey="marksheet" />
                  <DocumentRow label="Student Credit Card Document" docKey="student_credit_card_doc" />
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
                <h4 className={sectionHeaderCls}>Update Status</h4>
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
                    const a = selectedAdmission;
                    const scc = parseSccDetails(a);
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Admission Form - ${a.id}</title>
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
                            <p class="app-id">Application ID: ${a.id}</p>
                          </div>
                          <div class="form-section">
                            <h3>Personal Information</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Full Name:</span>
                                <div class="form-value">${a.name || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Father/Guardian Name:</span>
                                <div class="form-value">${a.father_name || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Mother Name:</span>
                                <div class="form-value">${a.mother_name || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Date of Birth:</span>
                                <div class="form-value">${a.dob || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Mobile Number:</span>
                                <div class="form-value">${a.mobile || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Email:</span>
                                <div class="form-value">${a.email || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Gender:</span>
                                <div class="form-value">${a.gender || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">UIDAI Number:</span>
                                <div class="form-value">${a.uidai_number || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Category:</span>
                                <div class="form-value">${a.category || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Registration Type:</span>
                                <div class="form-value">${a.registration_type || 'Regular'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Address</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Village/Town/City:</span>
                                <div class="form-value">${a.village_town_city || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Nearby:</span>
                                <div class="form-value">${a.nearby || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Police Station:</span>
                                <div class="form-value">${a.police_station || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Post Office:</span>
                                <div class="form-value">${a.post_office || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Block:</span>
                                <div class="form-value">${a.block || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">District:</span>
                                <div class="form-value">${a.district || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">State:</span>
                                <div class="form-value">${a.state || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Pincode:</span>
                                <div class="form-value">${a.pincode || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Education - Class 10th</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">School:</span>
                                <div class="form-value">${a.class_10th_school || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Subject:</span>
                                <div class="form-value">${a.class_10th_subject || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Marks Obtained:</span>
                                <div class="form-value">${a.class_10th_marks_obtained || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Total Marks:</span>
                                <div class="form-value">${a.class_10th_total_marks || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Percentage:</span>
                                <div class="form-value">${a.class_10th_percentage ? a.class_10th_percentage + '%' : 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Education - Class 12th</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">School:</span>
                                <div class="form-value">${a.class_12th_school || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Subject:</span>
                                <div class="form-value">${a.class_12th_subject || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Marks Obtained:</span>
                                <div class="form-value">${a.class_12th_marks_obtained || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Total Marks:</span>
                                <div class="form-value">${a.class_12th_total_marks || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Percentage:</span>
                                <div class="form-value">${a.class_12th_percentage ? a.class_12th_percentage + '%' : 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Admission Preferences</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Trade Applied:</span>
                                <div class="form-value">${a.trade || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Qualification:</span>
                                <div class="form-value">${a.qualification || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Session:</span>
                                <div class="form-value">${a.session || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Shift:</span>
                                <div class="form-value">${a.shift || 'N/A'}</div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Status:</span>
                                <div class="form-value">${(a.status || '').toUpperCase()}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Date Submitted:</span>
                                <div class="form-value">${a.dateSubmitted || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>PWD Information</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">PWD Claim:</span>
                                <div class="form-value">${a.pwd_claim || 'No'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">PWD Category:</span>
                                <div class="form-value">${a.pwd_category || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Student Credit Card</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Student Credit Card:</span>
                                <div class="form-value">${a.student_credit_card || 'No'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Bank Name:</span>
                                <div class="form-value">${scc.bank || 'N/A'}</div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Account Number:</span>
                                <div class="form-value">${scc.account || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                          <div class="form-section">
                            <h3>Documents Status</h3>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Photo:</span>
                                <div class="form-value">
                                  <span class="doc-status ${a.documents?.photo ? 'doc-yes' : 'doc-no'}">
                                    ${a.documents?.photo ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Aadhaar Card:</span>
                                <div class="form-value">
                                  <span class="doc-status ${a.documents?.aadhaar ? 'doc-yes' : 'doc-no'}">
                                    ${a.documents?.aadhaar ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-field">
                                <span class="form-label">Marksheet:</span>
                                <div class="form-value">
                                  <span class="doc-status ${a.documents?.marksheet ? 'doc-yes' : 'doc-no'}">
                                    ${a.documents?.marksheet ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
                                  </span>
                                </div>
                              </div>
                              <div class="form-field">
                                <span class="form-label">Student Credit Card Doc:</span>
                                <div class="form-value">
                                  <span class="doc-status ${a.documents?.student_credit_card_doc ? 'doc-yes' : 'doc-no'}">
                                    ${a.documents?.student_credit_card_doc ? '✓ YES - Uploaded' : '✗ NO - Not Available'}
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
                <h4 className={sectionHeaderCls}>Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className={inputCls} placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className={labelCls}>Father/Guardian Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={editFormData.father_name}
                      onChange={(e) => setEditFormData({ ...editFormData, father_name: e.target.value })}
                      className={inputCls} placeholder="Enter father/guardian name" />
                  </div>
                  <div>
                    <label className={labelCls}>Mother Name</label>
                    <input type="text" value={editFormData.mother_name}
                      onChange={(e) => setEditFormData({ ...editFormData, mother_name: e.target.value })}
                      className={inputCls} placeholder="Enter mother name" />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                    <input type="tel" required pattern="[0-9]{10}" value={editFormData.mobile}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      className={inputCls} placeholder="10 digit mobile number" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className={inputCls} placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" value={editFormData.dob}
                      onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                    <select required value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className={inputCls}>
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>UIDAI Number</label>
                    <input type="text" value={editFormData.uidai_number}
                      onChange={(e) => setEditFormData({ ...editFormData, uidai_number: e.target.value })}
                      className={inputCls} placeholder="12-digit Aadhaar number" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className={sectionHeaderCls}>Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Village/Town/City</label>
                    <input type="text" value={editFormData.village_town_city}
                      onChange={(e) => setEditFormData({ ...editFormData, village_town_city: e.target.value })}
                      className={inputCls} placeholder="Village/Town/City" />
                  </div>
                  <div>
                    <label className={labelCls}>Nearby</label>
                    <input type="text" value={editFormData.nearby}
                      onChange={(e) => setEditFormData({ ...editFormData, nearby: e.target.value })}
                      className={inputCls} placeholder="Nearby landmark" />
                  </div>
                  <div>
                    <label className={labelCls}>Police Station</label>
                    <input type="text" value={editFormData.police_station}
                      onChange={(e) => setEditFormData({ ...editFormData, police_station: e.target.value })}
                      className={inputCls} placeholder="Police Station" />
                  </div>
                  <div>
                    <label className={labelCls}>Post Office</label>
                    <input type="text" value={editFormData.post_office}
                      onChange={(e) => setEditFormData({ ...editFormData, post_office: e.target.value })}
                      className={inputCls} placeholder="Post Office" />
                  </div>
                  <div>
                    <label className={labelCls}>Block</label>
                    <input type="text" value={editFormData.block}
                      onChange={(e) => setEditFormData({ ...editFormData, block: e.target.value })}
                      className={inputCls} placeholder="Block" />
                  </div>
                  <div>
                    <label className={labelCls}>District</label>
                    <input type="text" value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      className={inputCls} placeholder="District" />
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    <select value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      className={inputCls}>
                      <option value="">Select State</option>
                      {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Pincode</label>
                    <input type="text" value={editFormData.pincode}
                      onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                      className={inputCls} placeholder="6-digit pincode" />
                  </div>
                </div>
              </div>

              {/* Education - 10th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 10th</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>School Name</label>
                    <input type="text" value={editFormData.class_10th_school}
                      onChange={(e) => setEditFormData({ ...editFormData, class_10th_school: e.target.value })}
                      className={inputCls} placeholder="School name" />
                  </div>
                  <div>
                    <label className={labelCls}>Marks Obtained</label>
                    <input type="number" value={editFormData.class_10th_marks_obtained}
                      onChange={(e) => {
                        const marks = e.target.value;
                        const pct = calcPercentage(marks, editFormData.class_10th_total_marks);
                        setEditFormData({ ...editFormData, class_10th_marks_obtained: marks, class_10th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Marks obtained" />
                  </div>
                  <div>
                    <label className={labelCls}>Total Marks</label>
                    <input type="number" value={editFormData.class_10th_total_marks}
                      onChange={(e) => {
                        const total = e.target.value;
                        const pct = calcPercentage(editFormData.class_10th_marks_obtained, total);
                        setEditFormData({ ...editFormData, class_10th_total_marks: total, class_10th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Total marks" />
                  </div>
                  <div>
                    <label className={labelCls}>Percentage</label>
                    <input type="text" readOnly value={editFormData.class_10th_percentage ? `${editFormData.class_10th_percentage}%` : ''}
                      className={`${inputCls} bg-slate-200 dark:bg-slate-700`} placeholder="Auto-calculated" />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input type="text" value={editFormData.class_10th_subject}
                      onChange={(e) => setEditFormData({ ...editFormData, class_10th_subject: e.target.value })}
                      className={inputCls} placeholder="Subject" />
                  </div>
                </div>
              </div>

              {/* Education - 12th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 12th</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>School Name</label>
                    <input type="text" value={editFormData.class_12th_school}
                      onChange={(e) => setEditFormData({ ...editFormData, class_12th_school: e.target.value })}
                      className={inputCls} placeholder="School name" />
                  </div>
                  <div>
                    <label className={labelCls}>Marks Obtained</label>
                    <input type="number" value={editFormData.class_12th_marks_obtained}
                      onChange={(e) => {
                        const marks = e.target.value;
                        const pct = calcPercentage(marks, editFormData.class_12th_total_marks);
                        setEditFormData({ ...editFormData, class_12th_marks_obtained: marks, class_12th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Marks obtained" />
                  </div>
                  <div>
                    <label className={labelCls}>Total Marks</label>
                    <input type="number" value={editFormData.class_12th_total_marks}
                      onChange={(e) => {
                        const total = e.target.value;
                        const pct = calcPercentage(editFormData.class_12th_marks_obtained, total);
                        setEditFormData({ ...editFormData, class_12th_total_marks: total, class_12th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Total marks" />
                  </div>
                  <div>
                    <label className={labelCls}>Percentage</label>
                    <input type="text" readOnly value={editFormData.class_12th_percentage ? `${editFormData.class_12th_percentage}%` : ''}
                      className={`${inputCls} bg-slate-200 dark:bg-slate-700`} placeholder="Auto-calculated" />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input type="text" value={editFormData.class_12th_subject}
                      onChange={(e) => setEditFormData({ ...editFormData, class_12th_subject: e.target.value })}
                      className={inputCls} placeholder="Subject" />
                  </div>
                </div>
              </div>

              {/* Admission Preferences */}
              <div>
                <h4 className={sectionHeaderCls}>Admission Preferences</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Trade <span className="text-red-500">*</span></label>
                    <select required value={editFormData.trade}
                      onChange={(e) => setEditFormData({ ...editFormData, trade: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Trade</option>
                      {trades.map((trade) => <option key={trade} value={trade}>{trade}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Qualification <span className="text-red-500">*</span></label>
                    <input type="text" required value={editFormData.qualification}
                      onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                      className={inputCls} placeholder="e.g., 10th Pass" />
                  </div>
                  <div>
                    <label className={labelCls}>Session</label>
                    <select value={editFormData.session}
                      onChange={(e) => setEditFormData({ ...editFormData, session: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Session</option>
                      {sessions.map((s) => <option key={s.id || s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Shift</label>
                    <select value={editFormData.shift}
                      onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Registration Type</label>
                    <select value={editFormData.registration_type}
                      onChange={(e) => setEditFormData({ ...editFormData, registration_type: e.target.value })}
                      className={inputCls}>
                      <option value="Regular">Regular</option>
                      <option value="Student Credit Card">Student Credit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status <span className="text-red-500">*</span></label>
                    <select required value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className={inputCls}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* PWD */}
              <div>
                <h4 className={sectionHeaderCls}>PWD Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>PWD Claim</label>
                    <select value={editFormData.pwd_claim}
                      onChange={(e) => setEditFormData({ ...editFormData, pwd_claim: e.target.value })}
                      className={inputCls}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {editFormData.pwd_claim === 'Yes' && (
                    <div>
                      <label className={labelCls}>PWD Category</label>
                      <input type="text" value={editFormData.pwd_category}
                        onChange={(e) => setEditFormData({ ...editFormData, pwd_category: e.target.value })}
                        className={inputCls} placeholder="PWD category" />
                    </div>
                  )}
                </div>
              </div>

              {/* Student Credit Card */}
              <div>
                <h4 className={sectionHeaderCls}>Student Credit Card</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Student Credit Card</label>
                    <select value={editFormData.student_credit_card}
                      onChange={(e) => setEditFormData({ ...editFormData, student_credit_card: e.target.value })}
                      className={inputCls}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {editFormData.student_credit_card === 'Yes' && (
                    <>
                      <div>
                        <label className={labelCls}>Bank Name</label>
                        <input type="text" value={editFormData.student_credit_card_bank}
                          onChange={(e) => setEditFormData({ ...editFormData, student_credit_card_bank: e.target.value })}
                          className={inputCls} placeholder="Bank name" />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input type="text" value={editFormData.student_credit_card_account}
                          onChange={(e) => setEditFormData({ ...editFormData, student_credit_card_account: e.target.value })}
                          className={inputCls} placeholder="Account number" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Documents Status */}
              <div>
                <h4 className={sectionHeaderCls}>Documents Status</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_photo ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Photo</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_photo ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_photo" checked={editFormData.has_photo === true}
                          onChange={() => setEditFormData({ ...editFormData, has_photo: true })} className="hidden" />
                        <CheckCircle className="h-3 w-3" /> YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_photo ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_photo" checked={editFormData.has_photo === false}
                          onChange={() => setEditFormData({ ...editFormData, has_photo: false })} className="hidden" />
                        <XCircle className="h-3 w-3" /> NO
                      </label>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_aadhaar ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Aadhaar Card</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_aadhaar ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_aadhaar" checked={editFormData.has_aadhaar === true}
                          onChange={() => setEditFormData({ ...editFormData, has_aadhaar: true })} className="hidden" />
                        <CheckCircle className="h-3 w-3" /> YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_aadhaar ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_aadhaar" checked={editFormData.has_aadhaar === false}
                          onChange={() => setEditFormData({ ...editFormData, has_aadhaar: false })} className="hidden" />
                        <XCircle className="h-3 w-3" /> NO
                      </label>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${editFormData.has_marksheet ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Marksheet</p>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${editFormData.has_marksheet ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_marksheet" checked={editFormData.has_marksheet === true}
                          onChange={() => setEditFormData({ ...editFormData, has_marksheet: true })} className="hidden" />
                        <CheckCircle className="h-3 w-3" /> YES
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors ${!editFormData.has_marksheet ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        <input type="radio" name="has_marksheet" checked={editFormData.has_marksheet === false}
                          onChange={() => setEditFormData({ ...editFormData, has_marksheet: false })} className="hidden" />
                        <XCircle className="h-3 w-3" /> NO
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
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manual Admission Entry</h3>
              <button
                onClick={() => {
                  setShowManualEntryModal(false);
                  setManualFormData({ ...defaultManualFormData });
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleManualEntry} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className={sectionHeaderCls}>Personal Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={manualFormData.name}
                      onChange={(e) => setManualFormData({ ...manualFormData, name: e.target.value })}
                      className={inputCls} placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className={labelCls}>Father/Guardian Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={manualFormData.father_name}
                      onChange={(e) => setManualFormData({ ...manualFormData, father_name: e.target.value })}
                      className={inputCls} placeholder="Enter father/guardian name" />
                  </div>
                  <div>
                    <label className={labelCls}>Mother Name</label>
                    <input type="text" value={manualFormData.mother_name}
                      onChange={(e) => setManualFormData({ ...manualFormData, mother_name: e.target.value })}
                      className={inputCls} placeholder="Enter mother name" />
                  </div>
                  <div>
                    <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                    <input type="tel" required pattern="[0-9]{10}" value={manualFormData.mobile}
                      onChange={(e) => setManualFormData({ ...manualFormData, mobile: e.target.value })}
                      className={inputCls} placeholder="10 digit mobile number" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={manualFormData.email}
                      onChange={(e) => setManualFormData({ ...manualFormData, email: e.target.value })}
                      className={inputCls} placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" value={manualFormData.dob}
                      onChange={(e) => setManualFormData({ ...manualFormData, dob: e.target.value })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select value={manualFormData.gender}
                      onChange={(e) => setManualFormData({ ...manualFormData, gender: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                    <select required value={manualFormData.category}
                      onChange={(e) => setManualFormData({ ...manualFormData, category: e.target.value })}
                      className={inputCls}>
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>UIDAI Number</label>
                    <input type="text" value={manualFormData.uidai_number}
                      onChange={(e) => setManualFormData({ ...manualFormData, uidai_number: e.target.value })}
                      className={inputCls} placeholder="12-digit Aadhaar number" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className={sectionHeaderCls}>Address</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Village/Town/City</label>
                    <input type="text" value={manualFormData.village_town_city}
                      onChange={(e) => setManualFormData({ ...manualFormData, village_town_city: e.target.value })}
                      className={inputCls} placeholder="Village/Town/City" />
                  </div>
                  <div>
                    <label className={labelCls}>Nearby</label>
                    <input type="text" value={manualFormData.nearby}
                      onChange={(e) => setManualFormData({ ...manualFormData, nearby: e.target.value })}
                      className={inputCls} placeholder="Nearby landmark" />
                  </div>
                  <div>
                    <label className={labelCls}>Police Station</label>
                    <input type="text" value={manualFormData.police_station}
                      onChange={(e) => setManualFormData({ ...manualFormData, police_station: e.target.value })}
                      className={inputCls} placeholder="Police Station" />
                  </div>
                  <div>
                    <label className={labelCls}>Post Office</label>
                    <input type="text" value={manualFormData.post_office}
                      onChange={(e) => setManualFormData({ ...manualFormData, post_office: e.target.value })}
                      className={inputCls} placeholder="Post Office" />
                  </div>
                  <div>
                    <label className={labelCls}>Block</label>
                    <input type="text" value={manualFormData.block}
                      onChange={(e) => setManualFormData({ ...manualFormData, block: e.target.value })}
                      className={inputCls} placeholder="Block" />
                  </div>
                  <div>
                    <label className={labelCls}>District</label>
                    <input type="text" value={manualFormData.district}
                      onChange={(e) => setManualFormData({ ...manualFormData, district: e.target.value })}
                      className={inputCls} placeholder="District" />
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    <select value={manualFormData.state}
                      onChange={(e) => setManualFormData({ ...manualFormData, state: e.target.value })}
                      className={inputCls}>
                      <option value="">Select State</option>
                      {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Pincode</label>
                    <input type="text" value={manualFormData.pincode}
                      onChange={(e) => setManualFormData({ ...manualFormData, pincode: e.target.value })}
                      className={inputCls} placeholder="6-digit pincode" />
                  </div>
                </div>
              </div>

              {/* Education - 10th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 10th</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>School Name</label>
                    <input type="text" value={manualFormData.class_10th_school}
                      onChange={(e) => setManualFormData({ ...manualFormData, class_10th_school: e.target.value })}
                      className={inputCls} placeholder="School name" />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input type="text" value={manualFormData.class_10th_subject}
                      onChange={(e) => setManualFormData({ ...manualFormData, class_10th_subject: e.target.value })}
                      className={inputCls} placeholder="Subject" />
                  </div>
                  <div>
                    <label className={labelCls}>Marks Obtained</label>
                    <input type="number" value={manualFormData.class_10th_marks_obtained}
                      onChange={(e) => {
                        const marks = e.target.value;
                        const pct = calcPercentage(marks, manualFormData.class_10th_total_marks);
                        setManualFormData({ ...manualFormData, class_10th_marks_obtained: marks, class_10th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Marks obtained" />
                  </div>
                  <div>
                    <label className={labelCls}>Total Marks</label>
                    <input type="number" value={manualFormData.class_10th_total_marks}
                      onChange={(e) => {
                        const total = e.target.value;
                        const pct = calcPercentage(manualFormData.class_10th_marks_obtained, total);
                        setManualFormData({ ...manualFormData, class_10th_total_marks: total, class_10th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Total marks" />
                  </div>
                  <div>
                    <label className={labelCls}>Percentage</label>
                    <input type="text" readOnly value={manualFormData.class_10th_percentage ? `${manualFormData.class_10th_percentage}%` : ''}
                      className={`${inputCls} bg-slate-200 dark:bg-slate-700`} placeholder="Auto-calculated" />
                  </div>
                </div>
              </div>

              {/* Education - 12th */}
              <div>
                <h4 className={sectionHeaderCls}>Education - Class 12th</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>School Name</label>
                    <input type="text" value={manualFormData.class_12th_school}
                      onChange={(e) => setManualFormData({ ...manualFormData, class_12th_school: e.target.value })}
                      className={inputCls} placeholder="School name" />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input type="text" value={manualFormData.class_12th_subject}
                      onChange={(e) => setManualFormData({ ...manualFormData, class_12th_subject: e.target.value })}
                      className={inputCls} placeholder="Subject" />
                  </div>
                  <div>
                    <label className={labelCls}>Marks Obtained</label>
                    <input type="number" value={manualFormData.class_12th_marks_obtained}
                      onChange={(e) => {
                        const marks = e.target.value;
                        const pct = calcPercentage(marks, manualFormData.class_12th_total_marks);
                        setManualFormData({ ...manualFormData, class_12th_marks_obtained: marks, class_12th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Marks obtained" />
                  </div>
                  <div>
                    <label className={labelCls}>Total Marks</label>
                    <input type="number" value={manualFormData.class_12th_total_marks}
                      onChange={(e) => {
                        const total = e.target.value;
                        const pct = calcPercentage(manualFormData.class_12th_marks_obtained, total);
                        setManualFormData({ ...manualFormData, class_12th_total_marks: total, class_12th_percentage: pct });
                      }}
                      className={inputCls} placeholder="Total marks" />
                  </div>
                  <div>
                    <label className={labelCls}>Percentage</label>
                    <input type="text" readOnly value={manualFormData.class_12th_percentage ? `${manualFormData.class_12th_percentage}%` : ''}
                      className={`${inputCls} bg-slate-200 dark:bg-slate-700`} placeholder="Auto-calculated" />
                  </div>
                </div>
              </div>

              {/* Admission Preferences */}
              <div>
                <h4 className={sectionHeaderCls}>Admission Preferences</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Trade <span className="text-red-500">*</span></label>
                    <select required value={manualFormData.trade}
                      onChange={(e) => setManualFormData({ ...manualFormData, trade: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Trade</option>
                      {trades.map((trade) => <option key={trade} value={trade}>{trade}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Qualification <span className="text-red-500">*</span></label>
                    <input type="text" required value={manualFormData.qualification}
                      onChange={(e) => setManualFormData({ ...manualFormData, qualification: e.target.value })}
                      className={inputCls} placeholder="e.g., 10th Pass" />
                  </div>
                  <div>
                    <label className={labelCls}>Session</label>
                    <select value={manualFormData.session}
                      onChange={(e) => setManualFormData({ ...manualFormData, session: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Session</option>
                      {sessions.map((s) => <option key={s.id || s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Shift</label>
                    <select value={manualFormData.shift}
                      onChange={(e) => setManualFormData({ ...manualFormData, shift: e.target.value })}
                      className={inputCls}>
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Registration Type</label>
                    <select value={manualFormData.registration_type}
                      onChange={(e) => setManualFormData({ ...manualFormData, registration_type: e.target.value })}
                      className={inputCls}>
                      <option value="Regular">Regular</option>
                      <option value="Student Credit Card">Student Credit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={manualFormData.status}
                      onChange={(e) => setManualFormData({ ...manualFormData, status: e.target.value })}
                      className={inputCls}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PWD */}
              <div>
                <h4 className={sectionHeaderCls}>PWD Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>PWD Claim</label>
                    <select value={manualFormData.pwd_claim}
                      onChange={(e) => setManualFormData({ ...manualFormData, pwd_claim: e.target.value })}
                      className={inputCls}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {manualFormData.pwd_claim === 'Yes' && (
                    <div>
                      <label className={labelCls}>PWD Category</label>
                      <input type="text" value={manualFormData.pwd_category}
                        onChange={(e) => setManualFormData({ ...manualFormData, pwd_category: e.target.value })}
                        className={inputCls} placeholder="PWD category" />
                    </div>
                  )}
                </div>
              </div>

              {/* Student Credit Card */}
              <div>
                <h4 className={sectionHeaderCls}>Student Credit Card</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Student Credit Card</label>
                    <select value={manualFormData.student_credit_card}
                      onChange={(e) => setManualFormData({ ...manualFormData, student_credit_card: e.target.value })}
                      className={inputCls}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {manualFormData.student_credit_card === 'Yes' && (
                    <>
                      <div>
                        <label className={labelCls}>Bank Name</label>
                        <input type="text" value={manualFormData.student_credit_card_bank}
                          onChange={(e) => setManualFormData({ ...manualFormData, student_credit_card_bank: e.target.value })}
                          className={inputCls} placeholder="Bank name" />
                      </div>
                      <div>
                        <label className={labelCls}>Account Number</label>
                        <input type="text" value={manualFormData.student_credit_card_account}
                          onChange={(e) => setManualFormData({ ...manualFormData, student_credit_card_account: e.target.value })}
                          className={inputCls} placeholder="Account number" />
                      </div>
                    </>
                  )}
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
                    setManualFormData({ ...defaultManualFormData });
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
