import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, GraduationCap, Users, BookOpen, Briefcase, ChevronDown, ChevronUp,
  Download, Phone, Mail, HelpCircle, Settings, Zap, FileText,
  ArrowRight, CheckCircle
} from 'lucide-react';
import { getHeaderSettings, getTradeBySlug, getTrades } from '../services/api';

// Fallback trade data
const fallbackTradesData = {
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    category: 'Engineering Trade',
    duration: '2 Years (4 Semesters)',
    eligibility: '10th Pass (Science & Math)',
    seats: '60 Seats (Per Session)',
    description: 'Master the skills of electrical systems, power distribution, domestic wiring, and industrial machinery maintenance in our state-of-the-art workshops equipped with modern testing tools.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      {
        title: 'Semester 1: Basics of Electricity & Tools',
        topics: [
          'Safety precautions and first aid',
          'Hand tools and their uses',
          'Fundamental of electricity and Ohm\'s law',
          'Common electrical fittings and accessories',
          'Basic wiring concepts'
        ]
      },
      {
        title: 'Semester 2: Wiring and Battery Systems',
        topics: [
          'Domestic wiring installation',
          'Types of wiring systems',
          'Battery charging and maintenance',
          'Electrical measuring instruments',
          'Earthing and safety devices'
        ]
      },
      {
        title: 'Semester 3: Motors, Alternators & Transformers',
        topics: [
          'AC & DC motors working principles',
          'Motor maintenance and troubleshooting',
          'Single phase transformers',
          'Three phase systems',
          'Industrial wiring'
        ]
      },
      {
        title: 'Semester 4: Advanced Systems & PLC',
        topics: [
          'PLC basics and programming',
          'Industrial automation',
          'Solar panel installation',
          'Project work and internship',
          'Industry exposure training'
        ]
      }
    ],
    careers: [
      { title: 'Public Sector', description: 'Opportunities in Railways, BSNL, Electricity Boards (MSEB, UPPCL), and DRDO.' },
      { title: 'Private Industries', description: 'Maintenance electrician roles in automobile, manufacturing, and textile plants.' },
      { title: 'Self-Employment', description: 'Start your own electrical consulting, domestic wiring, or repair shop.' },
      { title: 'Renewable Energy', description: 'Technician roles in the fast-growing Solar and Wind power installation sectors.' }
    ]
  },
  fitter: {
    id: 'fitter',
    name: 'Fitter',
    category: 'Engineering Trade',
    duration: '2 Years (4 Semesters)',
    eligibility: '10th Pass (Science & Math)',
    seats: '40 Seats (Per Session)',
    description: 'Learn precision fitting, assembly, and maintenance of mechanical components. Master the use of measuring instruments, machine tools, and modern manufacturing techniques.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      {
        title: 'Semester 1: Basic Fitting & Hand Tools',
        topics: [
          'Workshop safety and housekeeping',
          'Measuring instruments - Vernier, Micrometer',
          'Filing, sawing, and chipping operations',
          'Drilling and tapping',
          'Basic fitting exercises'
        ]
      },
      {
        title: 'Semester 2: Machine Operations',
        topics: [
          'Lathe machine operations',
          'Milling machine basics',
          'Grinding operations',
          'Sheet metal work',
          'Assembly techniques'
        ]
      },
      {
        title: 'Semester 3: Advanced Fitting',
        topics: [
          'Precision fitting and assembly',
          'Hydraulic and pneumatic systems',
          'Bearings and lubrication',
          'Maintenance practices',
          'Quality control basics'
        ]
      },
      {
        title: 'Semester 4: Industrial Applications',
        topics: [
          'CNC machine basics',
          'Industrial maintenance',
          'Project work',
          'Industry internship',
          'Soft skills training'
        ]
      }
    ],
    careers: [
      { title: 'Manufacturing', description: 'Work in automobile, aerospace, and heavy machinery manufacturing units.' },
      { title: 'Maintenance', description: 'Industrial maintenance technician in factories and power plants.' },
      { title: 'Defense Sector', description: 'Technical positions in ordnance factories and defense establishments.' },
      { title: 'Entrepreneurship', description: 'Start fabrication workshops or precision machining businesses.' }
    ]
  }
};

const TradeDetail = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [openModules, setOpenModules] = useState([0]);
  const [trade, setTrade] = useState(null);
  const [otherTrades, setOtherTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    phone: '+91-9155401839',
    email: 'manerpvtiti@gmail.com'
  });

  useEffect(() => {
    fetchTrade();
    fetchContactInfo();
    fetchOtherTrades();
    window.scrollTo(0, 0);
  }, [tradeId]);

  const fetchTrade = async () => {
    try {
      setLoading(true);
      const response = await getTradeBySlug(tradeId);
      setTrade(response.data);
      // Open first module by default
      if (response.data.syllabus_json && response.data.syllabus_json.length > 0) {
        setOpenModules([0]);
      }
    } catch (error) {
      console.error('Error fetching trade:', error);
      // Fallback to hardcoded data
      const fallback = fallbackTradesData[tradeId] || fallbackTradesData.electrician;
      setTrade(fallback);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherTrades = async () => {
    try {
      const response = await getTrades();
      const tradesData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data || []);
      const filtered = tradesData.filter(t => t.slug !== tradeId);
      setOtherTrades(filtered);
    } catch (error) {
      console.error('Error fetching other trades:', error);
      setOtherTrades([]);
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

  const toggleModule = (index) => {
    setOpenModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleDownloadSyllabus = () => {
    if (trade?.syllabus_pdf) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const baseUrl = apiUrl.replace('/api', '');
      window.open(`${baseUrl}${trade.syllabus_pdf}`, '_blank');
    } else {
      alert('Syllabus PDF not available');
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading trade information...</p>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="py-8 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Trade not found</p>
          <Link to="/trades" className="text-[#195de6] hover:underline">Back to Trades</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/" className="text-[#4e6797] dark:text-gray-400 text-sm font-medium hover:text-[#195de6]">Home</Link>
          <span className="text-[#4e6797] dark:text-gray-400 text-sm font-medium">/</span>
          <Link to="/trades" className="text-[#4e6797] dark:text-gray-400 text-sm font-medium hover:text-[#195de6]">Trades</Link>
          <span className="text-[#4e6797] dark:text-gray-400 text-sm font-medium">/</span>
          <span className="text-[#195de6] text-sm font-medium">{trade.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row">
                <div 
                  className="w-full lg:w-1/2 bg-center bg-no-repeat aspect-video lg:aspect-auto bg-cover min-h-[300px]"
                  style={{ backgroundImage: `url("${trade.image}")` }}
                />
                <div className="flex flex-col gap-6 p-8 lg:w-1/2 justify-center">
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[#195de6] font-bold text-xs uppercase tracking-widest">{trade.category}</span>
                    <h1 className="text-[#0e121b] dark:text-white text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                      {trade.name}
                    </h1>
                    <p className="text-[#4e6797] dark:text-gray-400 text-base font-normal leading-relaxed">
                      {trade.description}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleDownloadSyllabus}
                      disabled={!trade.syllabus_pdf}
                      className="flex-1 lg:flex-none min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#195de6] text-white text-base font-semibold transition-all hover:bg-[#1e40af] flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="h-5 w-5" />
                      {trade.syllabus_pdf ? 'Download Syllabus' : 'Syllabus Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c222d] p-6 flex-col">
                <div className="text-[#195de6]">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e121b] dark:text-white text-lg font-bold leading-tight">Duration</h2>
                  <p className="text-[#4e6797] dark:text-gray-400 text-sm font-normal">{trade.duration}</p>
                </div>
              </div>
              <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c222d] p-6 flex-col">
                <div className="text-[#195de6]">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e121b] dark:text-white text-lg font-bold leading-tight">Eligibility</h2>
                  <p className="text-[#4e6797] dark:text-gray-400 text-sm font-normal">{trade.eligibility}</p>
                </div>
              </div>
              <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c222d] p-6 flex-col">
                <div className="text-[#195de6]">
                  <Users className="h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0e121b] dark:text-white text-lg font-bold leading-tight">Available Seats</h2>
                  <p className="text-[#4e6797] dark:text-gray-400 text-sm font-normal">{trade.seats}</p>
                </div>
              </div>
            </div>

            {/* Course Content / Syllabus */}
            <section className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-[#0e121b] dark:text-white">
                <BookOpen className="h-6 w-6 text-[#195de6]" /> Course Syllabus
              </h3>
              <div className="space-y-4">
                {trade.syllabus_json && trade.syllabus_json.length > 0 ? (
                  trade.syllabus_json.map((module, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-[#1c222d] overflow-hidden">
                    <button 
                      onClick={() => toggleModule(index)}
                      className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <span className="font-semibold text-[#0e121b] dark:text-white">{module.title}</span>
                      {openModules.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-[#195de6]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {openModules.includes(index) && (
                      <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800">
                        <ul className="list-none text-sm text-[#4e6797] dark:text-gray-400 space-y-2 mt-4">
                          {module.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-[#195de6] mt-0.5 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>Syllabus information not available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Career Opportunities */}
            <section className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-[#0e121b] dark:text-white">
                <Briefcase className="h-6 w-6 text-[#195de6]" /> Career Opportunities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trade.careers_json && trade.careers_json.length > 0 ? (
                  trade.careers_json.map((career, index) => (
                  <div key={index} className="p-4 bg-[#195de6]/5 dark:bg-[#195de6]/10 border-l-4 border-[#195de6] rounded-r-lg">
                    <h4 className="font-semibold text-[#195de6] mb-1">{career.title}</h4>
                    <p className="text-sm text-[#4e6797] dark:text-gray-400 leading-relaxed">{career.description}</p>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>Career information not available</p>
                  </div>
                )}
              </div>
            </section>

            {/* Final CTA */}
            <div className="bg-[#195de6] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#195de6]/20">
              <div className="text-white text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">Ready to start your career?</h2>
                <p className="opacity-90">Enroll now for the upcoming academic session and secure your future.</p>
              </div>
              <Link 
                to="/apply-admission"
                className="bg-white text-[#195de6] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                APPLY FOR ADMISSION
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links Card */}
              <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col mb-6">
                  <h3 className="text-[#0e121b] dark:text-white text-lg font-semibold leading-normal">Other Trades</h3>
                  <p className="text-[#4e6797] dark:text-gray-400 text-sm font-normal">Explore our other programs</p>
                </div>
                <div className="flex flex-col gap-2">
                  {otherTrades.length > 0 ? (
                    otherTrades.map((otherTrade) => (
                      <Link 
                        key={otherTrade.id}
                        to={`/trades/${otherTrade.slug}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group transition-colors"
                      >
                        <div className="text-gray-400 group-hover:text-[#195de6]">
                          {otherTrade.slug === 'electrician' && <Zap className="h-5 w-5" />}
                          {otherTrade.slug === 'fitter' && <Settings className="h-5 w-5" />}
                        </div>
                        <p className="text-[#0e121b] dark:text-gray-300 text-sm font-medium">{otherTrade.name}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 px-3">No other trades available</p>
                  )}
                </div>
              </div>

              {/* Prospectus Card */}
              {trade.prospectus_pdf ? (
                <div className="bg-[#195de6]/10 border border-[#195de6]/20 rounded-xl p-6 text-center">
                  <FileText className="h-10 w-10 text-[#195de6] mx-auto mb-2" />
                  <h4 className="font-semibold text-[#0e121b] dark:text-white mb-2">College Prospectus</h4>
                  <p className="text-xs text-[#4e6797] dark:text-gray-400 mb-4">Get detailed information about fees, campus rules, and more.</p>
                  <a
                    href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${trade.prospectus_pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#195de6] text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-[#0e121b] dark:text-white mb-2">College Prospectus</h4>
                  <p className="text-xs text-[#4e6797] dark:text-gray-400 mb-4">Prospectus not available yet.</p>
                </div>
              )}

              {/* Contact/Help */}
              <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-[#0e121b] dark:text-white">
                  <HelpCircle className="h-5 w-5 text-[#195de6]" /> Need Help?
                </h4>
                <p className="text-sm text-[#4e6797] dark:text-gray-400 mb-4 italic">"Choosing the right trade is the first step to a great career."</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#0e121b] dark:text-white">
                    <Phone className="h-4 w-4 text-[#195de6]" />
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#0e121b] dark:text-white">
                    <Mail className="h-4 w-4 text-[#195de6]" />
                    <span>{contactInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;
