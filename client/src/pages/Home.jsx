import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Download, CreditCard, Calendar, ShieldCheck,
  ChevronRight, FileText, Clock, GraduationCap,
  School, Users, Award, ArrowRight, Briefcase, Zap
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
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { to: '/trades', icon: Download, label: 'Download Syllabus' },
            { to: '/fee-structure', icon: CreditCard, label: 'Fee Structure' },
            { to: '/results', icon: Calendar, label: 'Exam Results' },
            { to: '/about', icon: ShieldCheck, label: 'About Institute' },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="flex flex-col items-center p-4 sm:p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#195de6]/5 rounded-lg flex items-center justify-center mb-2.5 group-hover:bg-[#195de6] transition-colors">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#195de6] group-hover:text-white transition-colors" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-gray-800 text-center leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Credit Card Section */}
      {settings.credit_card_enabled === 'true' && (
        <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 sm:py-14">
          <div className="bg-[#195de6] rounded-2xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-white/5 rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="shrink-0">
                <div className="bg-white/10 p-5 rounded-xl">
                  <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
              <div className="flex-1 text-white text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{settings.credit_card_title}</h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5">{settings.credit_card_description}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link to="/apply-admission" className="bg-white text-[#195de6] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                    Apply Now
                  </Link>
                  <a href="https://www.7nishchay-yuvaupmission.bihar.gov.in/" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-10">
          <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Why Choose Maner Pvt ITI?</h2>
          <div className="w-16 h-0.5 bg-[#195de6] mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">World-class training facilities and expert guidance to shape your technical career</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-[#195de6]/5 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#195de6] transition-colors">
                <f.icon className="h-5 w-5 text-[#195de6] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Our Courses</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Professional Training Programs</h2>
            <div className="w-16 h-0.5 bg-[#195de6] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">NCVT certified programs designed for your successful career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {/* Electrician */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" alt="Electrician" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                <span className="absolute top-3 right-3 bg-[#195de6] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">NCVT Certified</span>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Electrician</h3>
                  <p className="text-white/80 text-xs">2 Year Diploma Course</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Master electrical installations, wiring systems, motor controls, and industrial automation with hands-on training.</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 2 Years</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> 10th Pass</span>
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> NCVT</span>
                </div>
                <Link to="/apply-admission" className="w-full bg-[#195de6] text-white py-2.5 rounded-lg font-semibold text-sm text-center hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1.5">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Fitter */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop" alt="Fitter" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                <span className="absolute top-3 right-3 bg-[#195de6] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">NCVT Certified</span>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Fitter</h3>
                  <p className="text-white/80 text-xs">2 Year Diploma Course</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Learn precision fitting, assembly, maintenance, and repair of machinery with expert training in metal cutting operations.</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 2 Years</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> 10th Pass</span>
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> NCVT</span>
                </div>
                <Link to="/apply-admission" className="w-full bg-[#195de6] text-white py-2.5 rounded-lg font-semibold text-sm text-center hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1.5">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
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
