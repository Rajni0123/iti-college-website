import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, GraduationCap, FileText, CheckCircle, Info, Phone, Mail, ArrowRight, ArrowLeft, Download, Printer, Check } from 'lucide-react';
import { applyAdmission, getHeaderSettings } from '../services/api';
import toast from 'react-hot-toast';

const ApplyAdmission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [uidaiCheckLoading, setUidaiCheckLoading] = useState(false);
  const [uidaiError, setUidaiError] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: '+91-9155401839',
    email: 'manerpvtiti@gmail.com'
  });

  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    mobile: '',
    email: '',
    dob: '',
    gender: '',
    category: '',
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
    trade: '',
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
    session: '',
    shift: '',
    photo: null,
    aadhaar: null,
    marksheet: null,
    student_credit_card_doc: null,
    student_credit_card: 'No',
    student_credit_card_bank: '',
    student_credit_card_account: '',
    declaration: false,
  });

  const [sessions, setSessions] = useState([]);
  const trades = ['Electrician', 'Fitter'];
  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'Other'];

  useEffect(() => {
    fetchContactInfo();
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await fetch(`${apiUrl}/sessions/active`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Failed to fetch sessions (${response.status})`);
        }
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      setSessions(data);
      
      // Auto-populate with first active session
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, session: data[0].session_name }));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error.message || 'Failed to load sessions. Please refresh the page.');
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await getHeaderSettings();
      if (response.data) {
        setContactInfo({
          phone: response.data.phone || '+91-9155401839',
          email: response.data.email || 'manerpvtiti@gmail.com'
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      const updatedData = { ...formData, [name]: value };
      
      // Check UIDAI number for duplicates when user enters 12 digits
      if (name === 'uidai_number') {
        setUidaiError('');
        if (value.length === 12) {
          checkUidaiDuplicate(value);
        }
      }
      
      // Auto-calculate percentage for Class 10th
      if (name === 'class_10th_marks_obtained' || name === 'class_10th_total_marks') {
        const obtained = name === 'class_10th_marks_obtained' ? value : formData.class_10th_marks_obtained;
        const total = name === 'class_10th_total_marks' ? value : formData.class_10th_total_marks;
        
        if (obtained && total && parseFloat(total) > 0) {
          const percentage = ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(2);
          updatedData.class_10th_percentage = percentage + '%';
        }
      }
      
      // Auto-calculate percentage for Class 12th
      if (name === 'class_12th_marks_obtained' || name === 'class_12th_total_marks') {
        const obtained = name === 'class_12th_marks_obtained' ? value : formData.class_12th_marks_obtained;
        const total = name === 'class_12th_total_marks' ? value : formData.class_12th_total_marks;
        
        if (obtained && total && parseFloat(total) > 0) {
          const percentage = ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(2);
          updatedData.class_12th_percentage = percentage + '%';
        }
      }
      
      setFormData(updatedData);
    }
  };

  const checkUidaiDuplicate = async (uidaiNumber) => {
    setUidaiCheckLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await fetch(`${apiUrl}/admissions/check-uidai/${uidaiNumber}`);
      const data = await response.json();
      
      if (response.status === 400) {
        setUidaiError(data.message);
        toast.error(data.message);
      } else if (response.ok && data.available) {
        toast.success('UIDAI number is available!');
      }
    } catch (error) {
      console.error('Error checking UIDAI:', error);
    } finally {
      setUidaiCheckLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.father_name || !formData.mother_name || !formData.mobile || !formData.email || !formData.dob || !formData.gender || !formData.category || !formData.uidai_number) {
          toast.error('Please fill all required fields');
          return false;
        }
        if (formData.mobile.length !== 10) {
          toast.error('Please enter a valid 10-digit mobile number');
          return false;
        }
        if (formData.uidai_number.length !== 12) {
          toast.error('UIDAI/Aadhaar number must be 12 digits');
          return false;
        }
        if (uidaiError) {
          toast.error('Please use a different UIDAI/Aadhaar number. This one is already registered.');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.village_town_city || !formData.police_station || !formData.post_office || !formData.block || !formData.district || !formData.state || !formData.pincode) {
          toast.error('Please fill all required address fields');
          return false;
        }
        if (formData.pincode.length !== 6) {
          toast.error('Please enter a valid 6-digit pincode');
          return false;
        }
        return true;
      case 3:
        if (!formData.class_10th_school || !formData.class_10th_marks_obtained || !formData.class_10th_total_marks) {
          toast.error('Please fill all required 10th class details');
          return false;
        }
        return true;
      case 4:
        if (!formData.trade || !formData.session) {
          toast.error('Please fill all required admission details');
          return false;
        }
        return true;
      case 5:
        if (!formData.photo || !formData.aadhaar || !formData.marksheet) {
          toast.error('Please upload all required documents');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.declaration) {
      toast.error('Please accept the declaration');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      // Pack student credit card details as JSON
      const creditCardDetails = formData.student_credit_card === 'Yes' ? JSON.stringify({
        bank_name: formData.student_credit_card_bank,
        account_number: formData.student_credit_card_account,
      }) : null;

      Object.keys(formData).forEach((key) => {
        if (key === 'declaration') return;
        if (key === 'student_credit_card_bank' || key === 'student_credit_card_account') return;
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      if (creditCardDetails) {
        data.append('student_credit_card_details', creditCardDetails);
      }
      data.append('registration_type', formData.student_credit_card === 'Yes' ? 'Student Credit Card' : 'Regular');
      data.append('declaration', formData.declaration);

      const response = await applyAdmission(data);
      setApplicationId(response.data.applicationId);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal', subtitle: 'Basic', icon: User },
    { number: 2, title: 'Address', subtitle: 'Location', icon: FileText },
    { number: 3, title: 'Education', subtitle: 'Qualification', icon: GraduationCap },
    { number: 4, title: 'Admission', subtitle: 'Preferences', icon: CheckCircle },
    { number: 5, title: 'Documents', subtitle: 'Upload', icon: Upload },
    { number: 6, title: 'Submit', subtitle: 'Final', icon: Check },
  ];

  const printReceiptRef = useRef(null);

  // Print Receipt Function
  const handlePrintReceipt = () => {
    const printContent = printReceiptRef.current;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Download PDF Function (uses print dialog with PDF option)
  const handleDownloadPDF = () => {
    const printContent = printReceiptRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Application Receipt - ${applicationId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #fff; }
          .receipt-container { max-width: 800px; margin: 0 auto; border: 2px solid #195de6; border-radius: 12px; overflow: hidden; }
          .receipt-header { background: linear-gradient(135deg, #195de6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; }
          .receipt-header h1 { font-size: 24px; margin-bottom: 5px; }
          .receipt-header p { opacity: 0.9; font-size: 14px; }
          .receipt-body { padding: 30px; }
          .app-id-box { background: #f0f9ff; border: 2px dashed #195de6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px; }
          .app-id-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
          .app-id-value { font-size: 32px; font-weight: 800; color: #195de6; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: 700; color: #195de6; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .info-label { color: #6b7280; font-size: 14px; }
          .info-value { font-weight: 600; color: #111827; font-size: 14px; }
          .receipt-footer { background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .receipt-footer p { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
          .receipt-footer .note { color: #dc2626; font-weight: 600; }
          .status-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-top: 10px; }
          @media print { body { padding: 20px; } .receipt-container { border: 1px solid #ccc; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); }
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Get current date formatted
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center space-y-6">
            <div className="size-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Check className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-900 dark:text-green-400">Application Submitted!</h2>
              <p className="text-green-700 dark:text-green-500 mt-2 text-lg">Your application for Session 2024-25 has been received successfully.</p>
            </div>
            <div className="bg-white dark:bg-[#1c222d] border border-green-100 dark:border-green-900 inline-block px-8 py-6 rounded-xl shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Your Application ID</p>
              <p className="text-4xl font-bold text-[#195de6]">{applicationId}</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Please save this Application ID for future reference. You will receive a confirmation SMS on your registered mobile number.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-6 h-12 rounded-lg bg-[#195de6] text-white font-bold hover:bg-[#1e40af] transition-colors"
              >
                <Download className="h-5 w-5" /> Download PDF
              </button>
              <button 
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-6 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111621] text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Printer className="h-5 w-5" /> Print Receipt
              </button>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-[#195de6] font-bold hover:underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Hidden Printable Receipt */}
        <div ref={printReceiptRef} className="hidden">
          <div className="receipt-container">
            <div className="receipt-header">
              <h1>MANER PVT ITI</h1>
              <p>Admission Application Receipt - Session 2024-25</p>
            </div>
            <div className="receipt-body">
              <div className="app-id-box">
                <div className="app-id-label">Application ID</div>
                <div className="app-id-value">{applicationId}</div>
                <div className="status-badge">✓ Successfully Submitted</div>
              </div>
              
              <div className="section">
                <div className="section-title">Personal Information</div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Applicant Name</span>
                    <span className="info-value">{formData.name || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Father's Name</span>
                    <span className="info-value">{formData.father_name || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Mobile Number</span>
                    <span className="info-value">{formData.mobile || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{formData.email || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{formData.gender || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category</span>
                    <span className="info-value">{formData.category || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">Education Details</div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Trade Applied</span>
                    <span className="info-value">{formData.trade || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Qualification</span>
                    <span className="info-value">{formData.qualification || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Percentage/CGPA</span>
                    <span className="info-value">{formData.percentage || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Passing Year</span>
                    <span className="info-value">{formData.passing_year || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">Documents Submitted</div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Passport Photo</span>
                    <span className="info-value">✓ Uploaded</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Aadhaar Card</span>
                    <span className="info-value">✓ Uploaded</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">10th Marksheet</span>
                    <span className="info-value">✓ Uploaded</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="receipt-footer">
              <p><strong>Submission Date:</strong> {getCurrentDate()}</p>
              <p className="note">Please keep this receipt safe for future reference.</p>
              <p style={{marginTop: '15px'}}>For queries, contact: {contactInfo.phone} | {contactInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Heading */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-[#0e121b] dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">Apply Online Admission</h1>
          <p className="text-[#4e6797] dark:text-gray-400 text-base md:text-lg font-normal">Session 2024-2025 Admissions are now open. Follow the steps below to complete your application.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Progress and Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Progress Stepper */}
            <div className="bg-white dark:bg-[#1c222d] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-700 -z-0"></div>
                <div 
                  className="absolute top-5 left-0 h-[2px] bg-[#195de6] transition-all duration-500 -z-0"
                  style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                ></div>

                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center gap-2 z-10 bg-white dark:bg-[#1c222d] px-2 md:px-4">
                    <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.number 
                        ? 'bg-[#195de6] text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {currentStep > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${
                        currentStep >= step.number 
                          ? 'text-[#0e121b] dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>{step.title}</p>
                      <p className={`text-xs ${
                        currentStep >= step.number 
                          ? 'text-[#4e6797] dark:text-gray-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>{step.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-[#1c222d] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-[#195de6]" />
                        Personal Information
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Enter your personal details as per official documents</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Full Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="As per 10th marksheet"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Father's Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="father_name"
                            value={formData.father_name}
                            onChange={handleChange}
                            placeholder="Enter father's name"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Mother's Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="mother_name"
                            value={formData.mother_name}
                            onChange={handleChange}
                            placeholder="Enter mother's name"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">
                            UIDAI/Aadhaar Number <span className="text-red-500">*</span>
                            {uidaiCheckLoading && <span className="text-blue-500 text-xs ml-2">Checking...</span>}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="uidai_number"
                              value={formData.uidai_number}
                              onChange={handleChange}
                              placeholder="12-digit Aadhaar number"
                              maxLength={12}
                              className={`w-full rounded-lg text-[#0e121b] dark:text-white border ${
                                uidaiError 
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                                  : formData.uidai_number.length === 12 && !uidaiCheckLoading && !uidaiError
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                  : 'border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621]'
                              } focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 pr-10 text-base outline-none transition-all`}
                            />
                            {formData.uidai_number.length === 12 && !uidaiCheckLoading && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {uidaiError ? (
                                  <span className="text-red-500 text-xl">✗</span>
                                ) : (
                                  <span className="text-green-500 text-xl">✓</span>
                                )}
                              </div>
                            )}
                          </div>
                          {uidaiError && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <span>⚠️</span> {uidaiError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Mobile Number <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Date of Birth <span className="text-red-500">*</span></label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Gender <span className="text-red-500">*</span></label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Category <span className="text-red-500">*</span></label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* PWD Section */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4">PWD (Persons with Disabilities) Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[#0e121b] dark:text-white text-base font-medium">Do you want to claim PWD category?</label>
                            <select
                              name="pwd_claim"
                              value={formData.pwd_claim}
                              onChange={handleChange}
                              className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          {formData.pwd_claim === 'Yes' && (
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-base font-medium">PWD Category</label>
                              <input
                                type="text"
                                name="pwd_category"
                                value={formData.pwd_category}
                                onChange={handleChange}
                                placeholder="Specify category (e.g., Visual, Hearing, etc.)"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Address Information */}
                {currentStep === 2 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#195de6]" />
                        Address Information
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Provide your complete residential address details</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Village/Town/City <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="village_town_city"
                            value={formData.village_town_city}
                            onChange={handleChange}
                            placeholder="Enter village/town/city name"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Nearby Landmark</label>
                          <input
                            type="text"
                            name="nearby"
                            value={formData.nearby}
                            onChange={handleChange}
                            placeholder="e.g., Near Railway Station"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Police Station <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="police_station"
                            value={formData.police_station}
                            onChange={handleChange}
                            placeholder="Nearest police station"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Post Office <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="post_office"
                            value={formData.post_office}
                            onChange={handleChange}
                            placeholder="Nearest post office"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Block <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="block"
                            value={formData.block}
                            onChange={handleChange}
                            placeholder="Enter block name"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">District <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Enter district"
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">State <span className="text-red-500">*</span></label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          >
                            <option value="">Select State</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Pincode <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Qualification Details */}
                {currentStep === 3 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-[#195de6]" />
                        Qualification Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Enter your educational qualifications</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Class 10th Details */}
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                          Class 10th Information
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">School Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="class_10th_school"
                                value={formData.class_10th_school}
                                onChange={handleChange}
                                placeholder="Enter school name"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Subject/Stream</label>
                              <input
                                type="text"
                                name="class_10th_subject"
                                value={formData.class_10th_subject}
                                onChange={handleChange}
                                placeholder="e.g., General, Science"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Marks Obtained <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="class_10th_marks_obtained"
                                value={formData.class_10th_marks_obtained}
                                onChange={handleChange}
                                placeholder="e.g., 425"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Out of Total <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="class_10th_total_marks"
                                value={formData.class_10th_total_marks}
                                onChange={handleChange}
                                placeholder="e.g., 500"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Percentage (%) <span className="text-green-600 text-xs">Auto-calculated</span></label>
                              <input
                                type="text"
                                name="class_10th_percentage"
                                value={formData.class_10th_percentage}
                                readOnly
                                placeholder="Auto-calculated"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 h-12 px-4 text-base outline-none cursor-not-allowed font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Class 12th Details (Optional) */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          Class 12th Information (Optional)
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">School/College Name</label>
                              <input
                                type="text"
                                name="class_12th_school"
                                value={formData.class_12th_school}
                                onChange={handleChange}
                                placeholder="Enter school/college name"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Subject/Stream</label>
                              <input
                                type="text"
                                name="class_12th_subject"
                                value={formData.class_12th_subject}
                                onChange={handleChange}
                                placeholder="e.g., Science, Commerce, Arts"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Marks Obtained</label>
                              <input
                                type="text"
                                name="class_12th_marks_obtained"
                                value={formData.class_12th_marks_obtained}
                                onChange={handleChange}
                                placeholder="e.g., 450"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Out of Total</label>
                              <input
                                type="text"
                                name="class_12th_total_marks"
                                value={formData.class_12th_total_marks}
                                onChange={handleChange}
                                placeholder="e.g., 500"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[#0e121b] dark:text-white text-sm font-medium">Percentage (%) <span className="text-green-600 text-xs">Auto-calculated</span></label>
                              <input
                                type="text"
                                name="class_12th_percentage"
                                value={formData.class_12th_percentage}
                                readOnly
                                placeholder="Auto-calculated"
                                className="w-full rounded-lg text-[#0e121b] dark:text-white border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 h-12 px-4 text-base outline-none cursor-not-allowed font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Admission Preferences */}
                {currentStep === 4 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#195de6]" />
                        Admission Preferences
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Select your preferred trade and session</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Academic Session <span className="text-red-500">*</span></label>
                          <select
                            name="session"
                            value={formData.session}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          >
                            <option value="">Select Session</option>
                            {sessions.map((session) => (
                              <option key={session.id} value={session.session_name}>
                                {session.session_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[#0e121b] dark:text-white text-base font-medium">Trade Selection <span className="text-red-500">*</span></label>
                          <select
                            name="trade"
                            value={formData.trade}
                            onChange={handleChange}
                            className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                          >
                            <option value="">Select ITI Trade</option>
                            {trades.map((trade) => (
                              <option key={trade} value={trade}>{trade}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* MIS ITI Code Display */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">MIS I.T.I CODE</p>
                            <p className="text-2xl font-bold text-[#195de6] mt-1">PR10001156</p>
                          </div>
                          <Info className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>

                      {/* Trade Info Card */}
                      {formData.trade && (
                        <div className="bg-[#195de6]/5 dark:bg-[#195de6]/10 border border-[#195de6]/20 rounded-xl p-5">
                          <h3 className="font-bold text-[#0e121b] dark:text-white mb-3 flex items-center gap-2">
                            <Info className="h-5 w-5 text-[#195de6]" />
                            About {formData.trade} Trade
                          </h3>
                          <p className="text-sm text-[#4e6797] dark:text-gray-400">
                            {formData.trade === 'Electrician' && 'Electrician is a 2-year NCVT certified course. Students learn electrical installations, wiring, motor repairs, and electrical maintenance work. Great career opportunities in industries, construction, and self-employment.'}
                            {formData.trade === 'Fitter' && 'Fitter is a 2-year NCVT certified course. Students learn fitting operations, machine tool operations, bench work, and assembly. Excellent opportunities in manufacturing industries, workshops, and maintenance departments.'}
                          </p>
                        </div>
                      )}

                      {/* Student Credit Card Section */}
                      <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4">Student Credit Card</h3>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[#0e121b] dark:text-white text-base font-medium">Are you applying through Student Credit Card?</label>
                            <select
                              name="student_credit_card"
                              value={formData.student_credit_card}
                              onChange={handleChange}
                              className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                          {formData.student_credit_card === 'Yes' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-2">
                                <label className="text-[#0e121b] dark:text-white text-sm font-medium">Bank Name <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  name="student_credit_card_bank"
                                  value={formData.student_credit_card_bank}
                                  onChange={handleChange}
                                  placeholder="e.g., State Bank of India"
                                  className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="text-[#0e121b] dark:text-white text-sm font-medium">Account/Reference Number</label>
                                <input
                                  type="text"
                                  name="student_credit_card_account"
                                  value={formData.student_credit_card_account}
                                  onChange={handleChange}
                                  placeholder="Account or reference number"
                                  className="w-full rounded-lg text-[#0e121b] dark:text-white border border-[#d0d7e7] dark:border-gray-700 bg-white dark:bg-[#111621] focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] h-12 px-4 text-base outline-none transition-all"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 5: Documents Upload */}
                {currentStep === 5 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#195de6]" />
                        Upload Documents
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <p className="text-[#4e6797] dark:text-gray-400 text-sm">Please upload clear scanned copies of your documents. Accepted formats: JPG, PNG, PDF</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Photo Upload */}
                        <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                          formData.photo 
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/10' 
                            : 'border-[#d0d7e7] dark:border-gray-700 bg-[#f8f9fc] dark:bg-[#111621] hover:border-[#195de6]'
                        }`}>
                          <label className="cursor-pointer w-full">
                            <input 
                              type="file" 
                              name="photo" 
                              accept="image/*" 
                              onChange={handleChange}
                              className="hidden" 
                            />
                            {formData.photo ? (
                              <>
                                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Uploaded!</p>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1 truncate max-w-full px-2">{formData.photo.name}</p>
                              </>
                            ) : (
                              <>
                                <User className="h-10 w-10 text-gray-400 group-hover:text-[#195de6] mx-auto mb-2 transition-colors" />
                                <p className="text-sm font-semibold text-[#0e121b] dark:text-white">Passport Photo <span className="text-red-500">*</span></p>
                                <p className="text-xs text-gray-500 mt-1">JPG/PNG (Max 50KB)</p>
                                <p className="text-xs text-[#195de6] mt-2 font-medium">Click to upload</p>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Aadhaar Upload */}
                        <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                          formData.aadhaar 
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/10' 
                            : 'border-[#d0d7e7] dark:border-gray-700 bg-[#f8f9fc] dark:bg-[#111621] hover:border-[#195de6]'
                        }`}>
                          <label className="cursor-pointer w-full">
                            <input 
                              type="file" 
                              name="aadhaar" 
                              accept=".pdf,.jpg,.jpeg,.png" 
                              onChange={handleChange}
                              className="hidden" 
                            />
                            {formData.aadhaar ? (
                              <>
                                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Uploaded!</p>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1 truncate max-w-full px-2">{formData.aadhaar.name}</p>
                              </>
                            ) : (
                              <>
                                <FileText className="h-10 w-10 text-gray-400 group-hover:text-[#195de6] mx-auto mb-2 transition-colors" />
                                <p className="text-sm font-semibold text-[#0e121b] dark:text-white">Aadhaar Card <span className="text-red-500">*</span></p>
                                <p className="text-xs text-gray-500 mt-1">PDF/JPG (Max 200KB)</p>
                                <p className="text-xs text-[#195de6] mt-2 font-medium">Click to upload</p>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Marksheet Upload */}
                        <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                          formData.marksheet 
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/10' 
                            : 'border-[#d0d7e7] dark:border-gray-700 bg-[#f8f9fc] dark:bg-[#111621] hover:border-[#195de6]'
                        }`}>
                          <label className="cursor-pointer w-full">
                            <input 
                              type="file" 
                              name="marksheet" 
                              accept=".pdf,.jpg,.jpeg,.png" 
                              onChange={handleChange}
                              className="hidden" 
                            />
                            {formData.marksheet ? (
                              <>
                                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Uploaded!</p>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1 truncate max-w-full px-2">{formData.marksheet.name}</p>
                              </>
                            ) : (
                              <>
                                <GraduationCap className="h-10 w-10 text-gray-400 group-hover:text-[#195de6] mx-auto mb-2 transition-colors" />
                                <p className="text-sm font-semibold text-[#0e121b] dark:text-white">10th Marksheet <span className="text-red-500">*</span></p>
                                <p className="text-xs text-gray-500 mt-1">PDF Only (Max 500KB)</p>
                                <p className="text-xs text-[#195de6] mt-2 font-medium">Click to upload</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Student Credit Card Document Upload */}
                      {formData.student_credit_card === 'Yes' && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-[#0e121b] dark:text-white mb-3">Student Credit Card Document</p>
                          <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group max-w-xs ${
                            formData.student_credit_card_doc
                              ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                              : 'border-[#d0d7e7] dark:border-gray-700 bg-[#f8f9fc] dark:bg-[#111621] hover:border-[#195de6]'
                          }`}>
                            <label className="cursor-pointer w-full">
                              <input
                                type="file"
                                name="student_credit_card_doc"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleChange}
                                className="hidden"
                              />
                              {formData.student_credit_card_doc ? (
                                <>
                                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">Uploaded!</p>
                                  <p className="text-xs text-green-600 dark:text-green-500 mt-1 truncate max-w-full px-2">{formData.student_credit_card_doc.name}</p>
                                </>
                              ) : (
                                <>
                                  <FileText className="h-10 w-10 text-gray-400 group-hover:text-[#195de6] mx-auto mb-2 transition-colors" />
                                  <p className="text-sm font-semibold text-[#0e121b] dark:text-white">Credit Card Document</p>
                                  <p className="text-xs text-gray-500 mt-1">PDF/JPG (Optional)</p>
                                  <p className="text-xs text-[#195de6] mt-2 font-medium">Click to upload</p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      )}

                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-400 flex items-start gap-2">
                          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <span>Make sure all documents are clearly visible and readable. Blurry or unclear documents may delay your application processing.</span>
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-xl font-semibold text-[#0e121b] dark:text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#195de6]" />
                        Review & Submit
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Application Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                          <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Personal Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.name || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Father's Name:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.father_name || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Mobile:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.mobile || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.email || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Category:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.category || '-'}</span></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                          <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Education Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Trade:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.trade || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Qualification:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.qualification || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Percentage:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.percentage || '-'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Passing Year:</span><span className="font-medium text-[#0e121b] dark:text-white">{formData.passing_year || '-'}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Documents Status */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Documents Uploaded</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            {formData.photo ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Info className="h-5 w-5 text-red-500" />}
                            <span className={formData.photo ? 'text-green-700 dark:text-green-400' : 'text-red-600'}>Photo</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.aadhaar ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Info className="h-5 w-5 text-red-500" />}
                            <span className={formData.aadhaar ? 'text-green-700 dark:text-green-400' : 'text-red-600'}>Aadhaar</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {formData.marksheet ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Info className="h-5 w-5 text-red-500" />}
                            <span className={formData.marksheet ? 'text-green-700 dark:text-green-400' : 'text-red-600'}>Marksheet</span>
                          </div>
                        </div>
                      </div>

                      {/* Declaration */}
                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                        <h3 className="font-semibold text-[#0e121b] dark:text-white mb-3">Declaration</h3>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="declaration"
                            checked={formData.declaration}
                            onChange={handleChange}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-[#195de6] focus:ring-[#195de6]"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>The details provided above were given by me. If any detail is incorrect, the institute has full authority to take action.</strong> I hereby declare that all information provided is true and correct to the best of my knowledge. I agree to abide by all rules and regulations of Maner Pvt ITI.
                            <span className="text-red-500 font-bold"> *</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Form Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 h-12 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-6 h-12 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 h-12 rounded-lg bg-[#195de6] text-white font-semibold hover:bg-[#1e40af] transition-colors flex items-center gap-2"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !formData.declaration}
                      className="px-8 h-12 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right Side: Side Panel */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Important Instructions */}
            <div className="bg-white dark:bg-[#1c222d] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0e121b] dark:text-white">
                <Info className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-lg">Instructions</h3>
              </div>
              <ul className="space-y-4 text-sm text-[#4e6797] dark:text-gray-400">
                <li className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-[#195de6] flex-shrink-0 mt-0.5" />
                  <span>Ensure all details match your <strong className="text-[#0e121b] dark:text-white">10th Class certificate</strong> precisely.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-[#195de6] flex-shrink-0 mt-0.5" />
                  <span>Upload documents in the specified file formats and size limits.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-[#195de6] flex-shrink-0 mt-0.5" />
                  <span>Mobile number verification will be required in the final step.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-[#195de6] flex-shrink-0 mt-0.5" />
                  <span>Keep your Application ID safe for future reference.</span>
                </li>
              </ul>
            </div>

            {/* Eligibility Summary */}
            <div className="bg-[#195de6]/5 dark:bg-[#195de6]/10 rounded-xl border border-[#195de6]/20 p-6">
              <h3 className="font-bold text-[#0e121b] dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#195de6]" />
                Eligibility Criteria
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm py-2 border-b border-[#195de6]/10">
                  <span className="text-[#4e6797] dark:text-gray-400">Minimum Age</span>
                  <span className="font-semibold text-[#0e121b] dark:text-white">14 Years</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-[#195de6]/10">
                  <span className="text-[#4e6797] dark:text-gray-400">Education</span>
                  <span className="font-semibold text-[#0e121b] dark:text-white">10th Pass (Min 35%)</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-[#4e6797] dark:text-gray-400">Domicile</span>
                  <span className="font-semibold text-[#0e121b] dark:text-white">State Resident</span>
                </div>
              </div>
            </div>

            {/* Help Desk Card */}
            <div className="bg-[#111621] text-white rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Our admission desk is available 10 AM to 5 PM (Mon-Sat).</p>
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-5 w-5 text-[#195de6]" />
                  <span className="font-semibold text-lg">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#195de6]" />
                  <span className="text-sm">{contactInfo.email}</span>
                </div>
              </div>
              {/* Abstract Decoration */}
              <div className="absolute -right-4 -bottom-4 size-24 bg-[#195de6]/20 rounded-full blur-2xl"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyAdmission;
