import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Phone, Mail, School, Menu, 
  Download, CreditCard, Calendar, ShieldCheck,
  ChevronRight, FileText, Clock, GraduationCap
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
    background_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdxCMlJMLVeJ6DemcOw2AIihGbiepX5MPWU8r750l9Vi7pmoTzGVhz-NKXuc0hRLtAOeE2CZfns5-KQWaN0o2jpL8zRMJ1F89VY4gQ1ZRt4NphdCl-E5D7SwEf22H9m9gjfOqbWYea0KCzyZ-fxa4KlT9Go5DizC2onmz_rywidkbWavMPS_UfzoIviQGKr7k5bwI46H13I34QQp4Z9JggtUXLiUm-Wl23DEPPI7_Jcr28lI7YfJgXmL23AqXcG5UU1n0O1njDu__y',
    cta_text: 'Apply Online Now',
    cta_link: '/apply-admission',
    cta2_text: 'Explore Trades',
    cta2_link: '/trades'
  });
  const [settings, setSettings] = useState({
    header_text: 'Admission Open for the Academic Session 2024-25. Apply now to secure your seat in Electrician and Fitter trades.',
    principal_name: 'Dr. Rajesh Kumar',
    principal_message: 'Welcome to Maner Pvt ITI, a premier institution committed to providing quality vocational training. Our mission is to empower students with technical skills that align with industry demands, ensuring successful careers and contributing to nation-building.',
    principal_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNxEaoEaDN2RG5KPxRiN6ylbDwfNpM-Cy5JHvNgvtYKaCyfaWqgvOb23E4Xi01HEJVymR6l6scH3XPEQcL3HfTG5CuxYnFt_qLECUasV7kcA8mNAiY9QAjnvTg3CIlHHq9lwNVglOYWVNeTMFgIT5tEj53mGvRf1Qp4iXLFnrKD2PS8mauQf3Ga2b1zZDCADG9qp3RQQi_fMYTt8HcKhHHEYgRYCNqQMUe3QxDOs_g6YhNJVSuQFVvq2iRAWXZJ6kvYqqalJCBskYe',
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
      setNotices(response.data.slice(0, 3)); // Get only the latest 3 notices
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await getSettings();
      // Merge with defaults to ensure all fields are present
      setSettings(prevSettings => ({
        ...prevSettings,
        ...response.data
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep using default settings already in state
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
      // Get the first active hero section
      if (response.data && response.data.length > 0) {
        setHeroData(prev => ({ ...prev, ...response.data[0] }));
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  // Combine all active flash news content for marquee display
  const getFlashNewsText = () => {
    if (flashNews.length > 0) {
      return flashNews.map(news => news.content).join(' | ');
    }
    return settings.header_text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return { day, month };
  };

  return (
    <div className="bg-white dark:bg-[#0e121b] font-display text-[#0e121b] dark:text-white">
      {/* Flash News Section */}
      <div className="bg-white dark:bg-[#111621]/50 border-b border-[#e7ebf3] flex items-stretch">
        <div className="bg-[#ef4444] text-white px-6 py-2 flex items-center font-bold text-sm uppercase whitespace-nowrap z-10">
          <span className="text-sm mr-2">📢</span>
          Flash News
        </div>
        <div className="marquee flex items-center bg-[#ef4444]/5 dark:bg-[#ef4444]/10 w-full italic text-sm font-medium text-[#0e121b] dark:text-gray-200">
          <p className="inline-block pl-[100%] animate-[marquee_30s_linear_infinite]">
            {getFlashNewsText()}
          </p>
        </div>
      </div>

      {/* Hero Section - Using shared component */}
      <HeroSection heroData={heroData} />

        {/* Quick Links Grid */}
        <section className="px-4 lg:px-20 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/syllabus" 
              className="group flex flex-col items-center p-6 bg-white dark:bg-[#111621] border border-[#d0d7e7] dark:border-gray-800 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Download className="h-8 w-8" />
              </div>
              <span className="font-semibold text-sm text-center">Download Syllabus</span>
            </Link>
            <Link 
              to="/fee-structure" 
              className="group flex flex-col items-center p-6 bg-white dark:bg-[#111621] border border-[#d0d7e7] dark:border-gray-800 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <CreditCard className="h-8 w-8" />
              </div>
              <span className="font-semibold text-sm text-center">Fee Structure</span>
            </Link>
            <Link 
              to="/exam-schedule" 
              className="group flex flex-col items-center p-6 bg-white dark:bg-[#111621] border border-[#d0d7e7] dark:border-gray-800 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <Calendar className="h-8 w-8" />
              </div>
              <span className="font-semibold text-sm text-center">Exam Schedule</span>
            </Link>
            <Link 
              to="/verification" 
              className="group flex flex-col items-center p-6 bg-white dark:bg-[#111621] border border-[#d0d7e7] dark:border-gray-800 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <span className="font-semibold text-sm text-center">Trainee Verification</span>
            </Link>
          </div>
          </section>

        {/* Student Credit Card Section */}
        {settings.credit_card_enabled === 'true' && (
          <section className="px-4 lg:px-20 py-12">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                    <CreditCard className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-white text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-3">{settings.credit_card_title}</h2>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    {settings.credit_card_description}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Link
                      to="/apply-admission"
                      className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
                    >
                      Apply Now
                    </Link>
                    <a
                      href="https://www.7nishchay-yuvaupmission.bihar.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        <section className="px-4 lg:px-20 py-16">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] mb-4">Why Choose Maner Pvt ITI?</h2>
              <p className="text-lg text-[#4e6797] max-w-2xl mx-auto">
                We offer world-class training facilities and expert guidance to shape your technical career
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">NCVT Certified</h3>
                <p className="text-[#4e6797]">
                  All our courses are NCVT approved and recognized nationwide for better career opportunities.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">Expert Faculty</h3>
                <p className="text-[#4e6797]">
                  Learn from experienced instructors with industry expertise and practical knowledge.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <School className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">Modern Infrastructure</h3>
                <p className="text-[#4e6797]">
                  State-of-the-art workshops and labs equipped with latest tools and machinery.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <ChevronRight className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">100% Placement Support</h3>
                <p className="text-[#4e6797]">
                  Dedicated placement cell connecting students with top companies for guaranteed jobs.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">Affordable Fees</h3>
                <p className="text-[#4e6797]">
                  Quality education at affordable fees with flexible installment options and scholarships.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-[#195de6]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-[#195de6]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e121b] mb-2">Flexible Batches</h3>
                <p className="text-[#4e6797]">
                  Morning and afternoon batches available to suit your schedule and convenience.
                </p>
              </div>
            </div>
        </section>

        {/* Trades Section */}
        <section className="bg-gradient-to-br from-[#195de6]/5 to-blue-50 dark:bg-[#111621]/80 py-20">
          <div className="px-4 lg:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#0e121b] mb-3">Our Professional Courses</h2>
              <p className="text-lg text-[#4e6797] max-w-2xl mx-auto">
                NCVT certified technical training programs designed for your successful career
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Electrician Course */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" 
                    alt="Electrician working"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                  <div className="absolute top-4 right-4 bg-[#195de6] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    NCVT Certified
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-[#195de6] p-3 rounded-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Electrician</h3>
                        <p className="text-blue-100 text-sm font-medium">2 Year Diploma Course</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-[#4e6797] leading-relaxed mb-6">
                    Master electrical installations, wiring systems, motor controls, and industrial automation with comprehensive hands-on training.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-[#195de6] mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">2 Years</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-[#195de6] mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">10th Pass</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-[#195de6] mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">NCVT</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/apply-admission"
                    className="w-full bg-[#195de6] text-white py-3 rounded-lg font-bold text-center hover:bg-[#1e40af] transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Apply Now <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Fitter Course */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop" 
                    alt="Fitter working in workshop"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    NCVT Certified
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-teal-600 p-3 rounded-lg">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Fitter</h3>
                        <p className="text-teal-100 text-sm font-medium">2 Year Diploma Course</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-[#4e6797] leading-relaxed mb-6">
                    Learn precision fitting, assembly, maintenance, and repair of machinery with expert training in metal cutting and industrial operations.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">2 Years</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">10th Pass</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-[#0e121b]">NCVT</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/apply-admission"
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold text-center hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Apply Now <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

          </div>
          </div>
        </section>

        {/* Notices and Info */}
        <section className="px-4 lg:px-20 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 border-b-2 border-[#195de6] mb-6 pb-2">
              <FileText className="h-6 w-6 text-[#195de6]" />
              <h2 className="text-2xl font-bold">Latest Notifications</h2>
            </div>
            <div className="space-y-4">
              {notices.length > 0 ? (
                <>
                  {notices.map((notice) => {
                    const { day, month } = formatDate(notice.created_at);
                    return (
                      <div key={notice.id} className="bg-white dark:bg-[#111621] p-4 rounded-lg border border-gray-200 dark:border-gray-800 flex items-start gap-4">
                        <div className="bg-[#195de6]/10 text-[#195de6] px-3 py-2 rounded text-center min-w-[60px]">
                          <p className="text-lg font-bold">{day}</p>
                          <p className="text-[10px] uppercase font-bold">{month}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#195de6] text-sm uppercase">Notice</p>
                          <h4 className="font-bold text-lg mb-1 leading-tight">{notice.title}</h4>
                          <p className="text-[#4e6797] text-sm">{notice.description}</p>
                          {notice.pdf && (
                            <a
                              href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/uploads/${notice.pdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs text-[#195de6] hover:underline font-medium"
                            >
                              <FileText className="h-3 w-3" />
                              View PDF
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="bg-white dark:bg-[#111621] p-8 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-[#4e6797]">No notices available at the moment.</p>
                </div>
              )}
              <Link 
                to="/notices"
                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-[#195de6] border-2 border-dashed border-gray-200 rounded-lg transition-colors block text-center"
              >
                View All Notifications
              </Link>
            </div>
          </div>
          <div className="bg-[#195de6] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">Principal's Message</h3>
              <div 
                className="size-20 bg-white/20 rounded-full mb-6 mx-auto bg-cover bg-center border-2 border-white" 
                style={{
                  backgroundImage: `url("${settings.principal_image}")`
                }}
              ></div>
              <p className="italic text-white/90 text-center text-sm leading-relaxed">
                "{settings.principal_message}"
              </p>
              <p className="text-center font-bold mt-4">- {settings.principal_name}</p>
              <p className="text-center text-[10px] uppercase tracking-widest text-white/70">Principal, Maner Pvt ITI</p>
            </div>
            <div className="mt-8">
              <Link 
                to="/contact"
                className="w-full bg-white text-[#195de6] font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors block text-center"
              >
                Contact Principal
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
};

export default Home;
