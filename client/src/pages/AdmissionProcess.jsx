import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Route, ClipboardList, List, CheckCircle, CreditCard,
  FileCheck, FileText, User, UserCircle, Heart, Award, 
  MapPin, ArrowUp, Download, Info, ArrowRight, GraduationCap,
  AlertCircle
} from 'lucide-react';
import { getAdmissionProcess } from '../services/api';

// Icon mapping function for steps
const getStepIcon = (iconName) => {
  const iconMap = {
    UserCheck: ClipboardList,
    FileText: FileText,
    Upload: ArrowUp,
    CheckCircle: CheckCircle,
    ClipboardList: ClipboardList,
    List: List,
    CreditCard: CreditCard
  };
  return iconMap[iconName] || ClipboardList;
};

// Document icon mapping
const getDocumentIcon = (docName) => {
  const lowerName = docName.toLowerCase();
  if (lowerName.includes('marksheet') || lowerName.includes('10th')) return FileText;
  if (lowerName.includes('aadhaar') || lowerName.includes('id')) return CreditCard;
  if (lowerName.includes('photo') || lowerName.includes('photograph')) return UserCircle;
  if (lowerName.includes('medical')) return Heart;
  if (lowerName.includes('caste')) return Award;
  if (lowerName.includes('income')) return CreditCard;
  if (lowerName.includes('domicile') || lowerName.includes('residence')) return MapPin;
  if (lowerName.includes('transfer')) return ArrowUp;
  return FileText;
};

// Determine if document is mandatory
const isMandatory = (docName) => {
  const lowerName = docName.toLowerCase();
  const optionalKeywords = ['if applicable', 'if required', 'caste', 'income', 'scholarship'];
  return !optionalKeywords.some(keyword => lowerName.includes(keyword));
};

const AdmissionProcess = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    hero_title: 'Admission Process',
    hero_subtitle: 'Your Journey to Technical Excellence Starts Here',
    hero_description: 'Follow our simple and transparent admission process to secure your seat in our NCVT certified courses.',
    eligibility_title: 'Eligibility Criteria',
    eligibility_criteria_json: [],
    steps_title: 'Admission Steps',
    steps_json: [],
    dates_title: 'Important Dates',
    important_dates_json: [],
    documents_title: 'Required Documents',
    required_documents_json: [],
    cta_title: 'Ready to Apply?',
    cta_description: 'Start your application process now. It\'s quick, easy, and completely online.',
    cta_button_text: 'Apply Online Now',
    cta_button_link: '/apply-admission'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAdmissionProcess();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching admission process:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0e121b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#195de6] mx-auto mb-4"></div>
          <p className="text-[#4e6797] dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const steps = data.steps_json || [];
  const requiredDocuments = data.required_documents_json || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e121b]">
      <main className="flex-1 flex justify-center py-8 px-4 md:px-10 lg:px-20">
        <div className="max-w-[1200px] w-full flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#4e5a97] dark:text-gray-400 font-medium hover:underline">
              Home
            </Link>
            <span className="text-[#4e5a97] dark:text-gray-500 font-medium">/</span>
            <span className="text-[#0e101b] dark:text-white font-medium">Admissions</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[#0e101b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Admission Process & Required Documents
            </h1>
            <p className="text-[#4e5a97] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
              Step-by-step guide for new applicants and checklist of documents needed for successful verification.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Left Column: Admission Process */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Admission Journey Card */}
              <div className="bg-white dark:bg-[#1a1d2e] rounded-xl p-6 shadow-sm border border-[#e7e9f3] dark:border-gray-800 h-fit">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Route className="h-5 w-5 text-[#195de6]" />
                  1. Admission Journey
                </h2>

                {/* Timeline */}
                {steps.length > 0 ? (
                  <div className="grid grid-cols-[40px_1fr] gap-x-4">
                    {steps.map((step, index) => {
                      const StepIcon = getStepIcon(step.icon);
                      const isLast = index === steps.length - 1;
                      const isActive = index === 0;

                      return (
                        <>
                          {/* Timeline Line and Icon */}
                          <div key={`icon-${index}`} className="flex flex-col items-center">
                            <div className={`flex items-center justify-center size-10 rounded-full ${
                              isActive 
                                ? 'bg-[#195de6] text-white' 
                                : 'bg-[#195de6]/20 text-[#195de6]'
                            }`}>
                              <StepIcon className="h-5 w-5" />
                            </div>
                            {!isLast && (
                              <div className={`w-[2px] h-16 grow ${
                                isActive 
                                  ? 'bg-[#195de6]' 
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}></div>
                            )}
                          </div>

                          {/* Step Content */}
                          <div key={`content-${index}`} className={`flex flex-col ${!isLast ? 'pb-10' : ''}`}>
                            <p className="text-[#0e101b] dark:text-white text-lg font-bold">
                              {step.title}
                            </p>
                            <p className="text-[#4e5a97] dark:text-gray-400 text-sm mt-1 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-500 dark:text-gray-400">Admission steps will be updated soon</p>
                  </div>
                )}
              </div>

              {/* CTA Banner */}
              <div className="bg-[#195de6] rounded-xl p-8 text-white relative overflow-hidden group shadow-lg shadow-[#195de6]/20">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
                  <p className="text-blue-100 mb-6 text-sm">
                    Join ITI College today and shape your future with technical excellence.
                  </p>
                  <Link
                    to={data.cta_button_link || '/apply-admission'}
                    className="inline-flex items-center gap-2 bg-white text-[#195de6] font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
                <GraduationCap className="absolute -right-4 -bottom-4 h-36 w-36 opacity-10 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Right Column: Required Documents */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Documents Header */}
              <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-[#195de6]" />
                  2. Required Documents Checklist
                </h2>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-[#195de6] text-white uppercase tracking-wider">
                    Mandatory
                  </span>
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-amber-400 text-white uppercase tracking-wider">
                    If Applicable
                  </span>
                </div>
              </div>

              {/* Documents Grid */}
              {requiredDocuments.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredDocuments.map((doc, index) => {
                      const DocIcon = getDocumentIcon(doc);
                      const mandatory = isMandatory(doc);
                      // Extract description if present (format: "Title - Description")
                      const parts = doc.split('(');
                      const title = parts[0].trim();
                      const description = parts[1] ? parts[1].replace(')', '').trim() : '';

                      return (
                        <div 
                          key={index} 
                          className="bg-white dark:bg-[#1a1d2e] p-5 rounded-xl border border-[#e7e9f3] dark:border-gray-800 flex items-start gap-4"
                        >
                          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                            mandatory 
                              ? 'bg-blue-50 dark:bg-blue-900/20' 
                              : 'bg-amber-50 dark:bg-amber-900/20'
                          }`}>
                            <DocIcon className={`h-5 w-5 ${
                              mandatory 
                                ? 'text-[#195de6]' 
                                : 'text-amber-500'
                            }`} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0e101b] dark:text-white">
                                {title}
                              </span>
                              <div 
                                className={`size-2 rounded-full ${
                                  mandatory 
                                    ? 'bg-[#195de6]' 
                                    : 'bg-amber-400'
                                }`} 
                                title={mandatory ? 'Mandatory' : 'If Applicable'}
                              ></div>
                            </div>
                            {description && (
                              <p className="text-xs text-[#4e5a97] dark:text-gray-400">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resources & Forms Section */}
                  <div className="bg-white dark:bg-[#1a1d2e] p-6 rounded-xl border border-[#e7e9f3] dark:border-gray-800 mt-2">
                    <h3 className="text-sm font-bold text-[#4e5a97] dark:text-gray-300 uppercase tracking-widest mb-4">
                      Resources & Forms
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <button className="flex items-center gap-3 px-6 py-3 border border-[#195de6] text-[#195de6] rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Download className="h-5 w-5" />
                        Admission Brochure (PDF)
                      </button>
                      <button className="flex items-center gap-3 px-6 py-3 border border-[#195de6] text-[#195de6] rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <FileText className="h-5 w-5" />
                        Medical Proforma
                      </button>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-900/30">
                    <Info className="h-5 w-5 text-[#195de6] shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <strong>Note:</strong> Original documents must be presented during verification. Self-attested copies should be clearly legible.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-[#1a1d2e] border border-[#e7e9f3] dark:border-gray-800 rounded-xl">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400">Required documents will be updated soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdmissionProcess;
