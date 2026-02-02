import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Download, CreditCard, Calendar, ShieldCheck,
  ChevronRight, FileText, Clock, GraduationCap,
  School, Users, Award, ArrowRight, Briefcase, Zap, Wrench
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { getNotices, getFlashNews, getSettings } from '../services/api';
import api from '../services/api';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [flashNews, setFlashNews] = useState([]);
  const [heroData, setHeroData] = useState({
    title: 'Shape Your Future With Technical Excellence.',
    subtitle: 'ADMISSION OPEN 2024-25',
    description: "Join the region's leading private ITI to master high-demand technical skills and get 100% placement assistance.",
    background_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&auto=format&fit=crop&q=80',
    cta_text: 'Apply Online Now',
    cta_link: '/apply-admission',
    cta2_text: 'Explore Trades',
    cta2_link: '/trades'
  });
  const [settings, setSettings] = useState({
    header_text: 'Admission Open for the Academic Session 2024-25. Apply now to secure your seat in Electrician and Fitter trades.',
    principal_name: 'Dr. Rajesh Kumar',
    principal_message: 'Welcome to Maner Pvt ITI, a premier institution committed to providing quality vocational training. Our mission is to empower students with technical skills that align with industry demands, ensuring successful careers and contributing to nation-building.',
    principal_image: '',
    credit_card_enabled: 'true',
    credit_card_title: 'Student Credit Card Facility Available',
    credit_card_description: 'Get financial support through Bihar Student Credit Card Scheme. Apply for interest-free loans up to ₹4 Lakhs for your technical education.'
  });

  useEffect(() => {
    fetchNotices();
    fetchSettings();
    fetchFlashNews();
    fetchHeroData();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await getNotices();
      setNotices(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await getSettings();
      setSettings(prevSettings => ({ ...prevSettings, ...response.data }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchFlashNews = async () => {
    try {
      const response = await getFlashNews();
      setFlashNews(response.data || []);
    } catch (error) {
      console.error('Error fetching flash news:', error);
    }
  };

  const fetchHeroData = async () => {
    try {
      const response = await api.get('/hero');
      if (response.data && response.data.length > 0) {
        setHeroData(prev => ({ ...prev, ...response.data[0] }));
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  const getFlashNewsText = () => {
    if (flashNews.length > 0) {
      return flashNews.map(news => news.content).join('  \u00A0\u00A0|\u00A0\u00A0  ');
    }
    return settings.header_text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, month };
  };

  const features = [
    { icon: ShieldCheck, title: 'NCVT Certified', desc: 'All courses are NCVT approved and recognized nationwide.' },
    { icon: Users, title: 'Expert Faculty', desc: 'Experienced instructors with industry expertise.' },
    { icon: School, title: 'Modern Labs', desc: 'State-of-the-art workshops with latest equipment.' },
    { icon: Briefcase, title: 'Placement Support', desc: 'Dedicated placement cell for career opportunities.' },
    { icon: CreditCard, title: 'Affordable Fees', desc: 'Quality education with flexible payment options.' },
    { icon: Clock, title: 'Flexible Batches', desc: 'Morning and afternoon batches available.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Flash News */}
      <div className="bg-white border-b border-gray-200 flex items-stretch overflow-hidden">
        <div className="bg-[#195de6] text-white px-4 sm:px-6 py-2.5 flex items-center font-semibold text-xs uppercase whitespace-nowrap shrink-0">
          <span className="mr-2">&#9679;</span>
          Updates
        </div>
        <div className="marquee flex items-center w-full text-sm text-gray-600">
          <p className="inline-block pl-[100%] animate-[marquee_30s_linear_infinite]">
            {getFlashNewsText()}
          </p>
        </div>
      </div>

      {/* Hero */}
      <HeroSection heroData={heroData} />

      {/* Quick Links */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 sm:p-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {[
              { to: '/trades', icon: Download, label: 'Download Syllabus', desc: 'Course curriculum & details' },
              { to: '/fee-structure', icon: CreditCard, label: 'Fee Structure', desc: 'Transparent fee details' },
              { to: '/results', icon: Calendar, label: 'Exam Results', desc: 'Check your results online' },
              { to: '/about', icon: ShieldCheck, label: 'About Institute', desc: 'Know more about us' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-4 sm:py-5 hover:bg-[#195de6]/[0.03] transition-colors group rounded-xl"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#195de6] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-[#195de6]/20">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-gray-900 block leading-tight group-hover:text-[#195de6] transition-colors">{item.label}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 leading-tight hidden sm:block mt-0.5">{item.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Card Section */}
      {settings.credit_card_enabled === 'true' && (
        <section className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-14">
          <div className="bg-[#195de6] rounded-xl sm:rounded-2xl p-4 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full hidden sm:block"></div>
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-white/5 rounded-full hidden sm:block"></div>
            <div className="relative z-10 flex flex-row items-center gap-3 sm:gap-8">
              <div className="shrink-0">
                <div className="bg-white/10 p-3 sm:p-5 rounded-lg sm:rounded-xl">
                  <CreditCard className="h-6 w-6 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-white min-w-0">
                <h2 className="text-sm sm:text-2xl font-bold mb-0.5 sm:mb-2 leading-tight">{settings.credit_card_title}</h2>
                <p className="text-white/80 text-[11px] sm:text-base leading-snug sm:leading-relaxed mb-2 sm:mb-5 line-clamp-2 sm:line-clamp-none">{settings.credit_card_description}</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link to="/apply-admission" className="bg-white text-[#195de6] px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold text-[11px] sm:text-sm hover:bg-gray-50 transition-colors">
                    Apply Now
                  </Link>
                  <a href="https://www.7nishchay-yuvaupmission.bihar.gov.in/" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold text-[11px] sm:text-sm hover:bg-white/10 transition-colors">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-2 sm:mb-3">Why Choose Maner Pvt ITI?</h2>
          <div className="w-12 sm:w-16 h-0.5 bg-[#195de6] mx-auto mb-2 sm:mb-3"></div>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-xl mx-auto">World-class training facilities and expert guidance to shape your technical career</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-3.5 sm:p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(25,93,230,0.15)] hover:-translate-y-1 transition-all duration-300 group border border-gray-100/80">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#195de6] rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 shadow-lg shadow-[#195de6]/25 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1.5 group-hover:text-[#195de6] transition-colors leading-tight">{f.title}</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm leading-snug sm:leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Our Courses</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Professional Training Programs</h2>
            <div className="w-16 h-0.5 bg-[#195de6] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">NCVT certified programs designed for your successful career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Electrician */}
            <div className="bg-white rounded-2xl overflow-hidden group shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(25,93,230,0.18)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" alt="Electrician" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#195de6] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Award className="h-3 w-3" /> NCVT Certified
                </div>
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-[#195de6] rounded-lg flex items-center justify-center shadow-lg">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/70 text-xs font-medium">Trade #01</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Electrician</h3>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-gray-500 text-sm leading-relaxed mb-5">Master electrical installations, wiring systems, motor controls, and industrial automation with hands-on practical training.</p>
                <div className="flex items-center gap-2 mb-5">
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#195de6]" /> 2 Years
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <GraduationCap className="h-3.5 w-3.5 text-[#195de6]" /> 10th Pass
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <Award className="h-3.5 w-3.5 text-[#195de6]" /> NCVT
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link to="/apply-admission" className="flex-1 bg-[#195de6] text-white py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#195de6]/20">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/trades" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-[#195de6] bg-[#195de6]/5 hover:bg-[#195de6]/10 transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Fitter */}
            <div className="bg-white rounded-2xl overflow-hidden group shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(25,93,230,0.18)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop" alt="Fitter" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#195de6] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Award className="h-3 w-3" /> NCVT Certified
                </div>
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 bg-[#195de6] rounded-lg flex items-center justify-center shadow-lg">
                      <Wrench className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/70 text-xs font-medium">Trade #02</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Fitter</h3>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-gray-500 text-sm leading-relaxed mb-5">Learn precision fitting, assembly, maintenance, and repair of machinery with expert training in metal cutting operations.</p>
                <div className="flex items-center gap-2 mb-5">
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#195de6]" /> 2 Years
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <GraduationCap className="h-3.5 w-3.5 text-[#195de6]" /> 10th Pass
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <Award className="h-3.5 w-3.5 text-[#195de6]" /> NCVT
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link to="/apply-admission" className="flex-1 bg-[#195de6] text-white py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#195de6]/20">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/trades" className="px-4 py-2.5 rounded-xl font-semibold text-sm text-[#195de6] bg-[#195de6]/5 hover:bg-[#195de6]/10 transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notices + Principal */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Notices */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5 pb-2.5 border-b border-gray-200">
              <FileText className="h-5 w-5 text-[#195de6]" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Latest Notifications</h2>
            </div>
            <div className="space-y-3">
              {notices.length > 0 ? notices.map((notice) => {
                const { day, month } = formatDate(notice.created_at);
                return (
                  <div key={notice.id} className="bg-white p-4 rounded-lg border border-gray-100 flex items-start gap-3.5">
                    <div className="bg-[#195de6]/5 text-[#195de6] px-2.5 py-1.5 rounded-md text-center min-w-[50px] shrink-0">
                      <p className="text-base font-bold leading-tight">{day}</p>
                      <p className="text-[9px] uppercase font-bold">{month}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-0.5 leading-snug">{notice.title}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">{notice.description}</p>
                      {notice.pdf && (
                        <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/uploads/${notice.pdf}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 text-xs text-[#195de6] hover:underline font-medium">
                          <FileText className="h-3 w-3" /> View PDF
                        </a>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="bg-white p-6 rounded-lg border border-gray-100 text-center">
                  <p className="text-gray-400 text-sm">No notices available at the moment.</p>
                </div>
              )}
              <Link to="/notices" className="w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-[#195de6] border border-dashed border-gray-200 rounded-lg transition-colors block text-center hover:border-[#195de6]/30">
                View All Notifications
              </Link>
            </div>
          </div>

          {/* Principal's Message */}
          <div className="bg-[#195de6] text-white p-6 sm:p-7 rounded-xl flex flex-col">
            <h3 className="text-lg font-bold mb-5">Principal's Message</h3>
            <div className="w-16 h-16 bg-white/10 rounded-full mb-4 mx-auto bg-cover bg-center border-2 border-white/20" style={{ backgroundImage: `url("${settings.principal_image}")` }}></div>
            <p className="italic text-white/80 text-center text-xs sm:text-sm leading-relaxed flex-1">"{settings.principal_message}"</p>
            <div className="text-center mt-4 mb-5">
              <p className="font-bold text-sm">- {settings.principal_name}</p>
              <p className="text-[9px] uppercase tracking-widest text-white/60 mt-0.5">Principal, Maner Pvt ITI</p>
            </div>
            <Link to="/contact" className="w-full bg-white text-[#195de6] font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors block text-center">
              Contact Principal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
