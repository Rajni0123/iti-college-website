import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Target, Eye, Award, ShieldCheck, GraduationCap, 
  Users, Briefcase, CheckCircle, Star, TrendingUp, Clock,
  BookOpen, Heart, Zap, ArrowRight, Phone, Mail, MapPin
} from 'lucide-react';
import { getHeaderSettings, getAbout } from '../services/api';

// Icon mapping function
const getIcon = (iconName) => {
  const iconMap = {
    GraduationCap, Briefcase, Award, Users, ShieldCheck, Heart, TrendingUp,
    BookOpen, Zap, Building2, Target, Eye, CheckCircle, Star, Clock
  };
  return iconMap[iconName] || Award;
};

const About = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({
    hero_title: 'Shaping Futures Through',
    hero_subtitle: 'Technical Excellence',
    hero_description: 'Maner Pvt ITI is a premier institution committed to providing quality vocational training and empowering students with industry-relevant technical skills.',
    hero_image: '',
    about_title: 'About Maner Pvt ITI',
    about_description: 'Maner Pvt ITI has been a pioneer in technical education, providing quality training to students and preparing them for successful careers in various trades.',
    about_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    mission_title: 'Our Mission',
    mission_description: 'To provide quality technical education and skill development training that empowers students with industry-relevant skills.',
    vision_title: 'Our Vision',
    vision_description: 'To become a leading institution in technical education, recognized for excellence in skill development.',
    principal_name: 'Dr. Rajesh Kumar',
    principal_message: 'Welcome to Maner Pvt ITI, a premier institution committed to providing quality vocational training.',
    principal_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNxEaoEaDN2RG5KPxRiN6ylbDwfNpM-Cy5JHvNgvtYKaCyfaWqgvOb23E4Xi01HEJVymR6l6scH3XPEQcL3HfTG5CuxYnFt_qLECUasV7kcA8mNAiY9QAjnvTg3CIlHHq9lwNVglOYWVNeTMFgIT5tEj53mGvRf1Qp4iXLFnrKD2PS8mauQf3Ga2b1zZDCADG9qp3RQQi_fMYTt8HcKhHHEYgRYCNqQMUe3QxDOs_g6YhNJVSuQFVvq2iRAWXZJ6kvYqqalJCBskYe',
    stats_json: [],
    values_json: [],
    features_json: []
  });
  const [settings, setSettings] = useState({
    phone: '+91-9155401839',
    email: 'manerpvtiti@gmail.com',
    address: 'Maner, Mahinawan, Near Vishwakarma Mandir, Maner, Patna - 801108'
  });

  useEffect(() => {
    fetchAboutData();
    fetchSettings();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await getAbout();
      if (response.data) {
        setAboutData(response.data);
      }
    } catch (error) {
      console.error('Error fetching about page:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await getHeaderSettings();
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          phone: response.data.phone || prev.phone,
          email: response.data.email || prev.email
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
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

  const stats = aboutData.stats_json || [];
  const values = aboutData.values_json || [];
  const features = aboutData.features_json || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e121b]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#195de6] to-[#1e40af] text-white py-20 px-4 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center">
            <span className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-4 block">About Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {aboutData.hero_title || 'Shaping Futures Through'}
              <br />
              <span className="text-yellow-300">{aboutData.hero_subtitle || 'Technical Excellence'}</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              {aboutData.hero_description || 'Maner Pvt ITI is a premier institution committed to providing quality vocational training and empowering students with industry-relevant technical skills.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apply-admission"
                className="bg-white text-[#195de6] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Apply Now
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 lg:px-20 -mt-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = getIcon(stat.icon);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className="bg-[#195de6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#195de6]" />
                  </div>
                  <p className="text-3xl font-bold text-[#195de6] mb-2">{stat.value}</p>
                  <p className="text-sm text-[#4e6797] dark:text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Institution */}
      <section className="py-16 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] dark:text-white mt-2 mb-6">
                {aboutData.about_title || 'About Maner Pvt ITI'}
              </h2>
              <div className="w-24 h-1 bg-[#195de6] mb-6"></div>
              <div className="text-[#4e6797] dark:text-gray-400 text-lg leading-relaxed mb-6 whitespace-pre-line">
                {aboutData.about_description || 'Maner Pvt ITI has been a pioneer in technical education, providing quality training to students and preparing them for successful careers in various trades.'}
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#195de6] mt-1 flex-shrink-0" />
                  <p className="text-[#4e6797] dark:text-gray-400">Government recognized institution</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#195de6] mt-1 flex-shrink-0" />
                  <p className="text-[#4e6797] dark:text-gray-400">NCVT certified courses</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#195de6] mt-1 flex-shrink-0" />
                  <p className="text-[#4e6797] dark:text-gray-400">Modern workshops and laboratories</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#195de6] mt-1 flex-shrink-0" />
                  <p className="text-[#4e6797] dark:text-gray-400">100% placement assistance</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutData.about_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'}
                  alt="Maner Pvt ITI Campus"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#195de6]/80 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1c222d] rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="bg-[#195de6]/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-[#195de6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0e121b] dark:text-white">NCVT</p>
                    <p className="text-sm text-[#4e6797] dark:text-gray-400">Certified Institution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 lg:px-20 bg-white dark:bg-[#1c222d]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">Our Foundation</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] dark:text-white mt-2 mb-4">
              Mission & Vision
            </h2>
            <div className="w-24 h-1 bg-[#195de6] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#195de6] to-[#1e40af] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative z-10">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{aboutData.mission_title || 'Our Mission'}</h3>
                <p className="text-white/90 leading-relaxed">
                  {aboutData.mission_description || 'To provide quality technical education and skill development training that empowers students with industry-relevant skills, fostering employability and entrepreneurship.'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0e121b] border-2 border-[#195de6] rounded-2xl p-8 relative overflow-hidden">
              <div className="bg-[#195de6]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-[#195de6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0e121b] dark:text-white mb-4">{aboutData.vision_title || 'Our Vision'}</h3>
              <p className="text-[#4e6797] dark:text-gray-400 leading-relaxed">
                {aboutData.vision_description || 'To become a leading institution in technical education, recognized for excellence in skill development and producing skilled professionals who contribute to the nation\'s industrial growth and development.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] dark:text-white mt-2 mb-4">
              Our Core Values
            </h2>
            <div className="w-24 h-1 bg-[#195de6] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 text-center"
                >
                  <div className="bg-[#195de6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#195de6]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0e121b] dark:text-white mb-3">{value.title}</h3>
                  <p className="text-[#4e6797] dark:text-gray-400 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 lg:px-20 bg-white dark:bg-[#1c222d]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] dark:text-white mt-2 mb-4">
              What Makes Us Different
            </h2>
            <div className="w-24 h-1 bg-[#195de6] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-[#0e121b] dark:to-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#195de6]/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-[#195de6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0e121b] dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-[#4e6797] dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-gradient-to-r from-[#195de6] to-[#1e40af] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="relative">
                    <img
                      src={aboutData.principal_image || settings.principal_image}
                      alt={aboutData.principal_name || settings.principal_name}
                      className="w-full max-w-[300px] mx-auto rounded-2xl shadow-2xl border-4 border-white/20"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Star className="h-6 w-6 text-yellow-300" />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-2 block">Message from</span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.principal_name || settings.principal_name}</h3>
                  <div className="w-24 h-1 bg-yellow-300 mb-6"></div>
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    {aboutData.principal_message || settings.principal_message}
                  </p>
                  <div className="flex items-center gap-2 text-white/80">
                    <Award className="h-5 w-5" />
                    <span className="text-sm">Principal, Maner Pvt ITI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliation & Recognition */}
      <section className="py-16 px-4 lg:px-20 bg-white dark:bg-[#1c222d]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">Recognition</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e121b] dark:text-white mt-2 mb-4">
              Affiliation & Recognition
            </h2>
            <div className="w-24 h-1 bg-[#195de6] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#195de6]/10 to-[#195de6]/5 border border-[#195de6]/20 rounded-xl p-6 text-center">
              <Award className="h-12 w-12 text-[#195de6] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0e121b] dark:text-white mb-2">NCVT Affiliated</h3>
              <p className="text-sm text-[#4e6797] dark:text-gray-400">All courses are NCVT certified</p>
            </div>
            <div className="bg-gradient-to-br from-[#195de6]/10 to-[#195de6]/5 border border-[#195de6]/20 rounded-xl p-6 text-center">
              <ShieldCheck className="h-12 w-12 text-[#195de6] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0e121b] dark:text-white mb-2">Government Recognized</h3>
              <p className="text-sm text-[#4e6797] dark:text-gray-400">Officially recognized institution</p>
            </div>
            <div className="bg-gradient-to-br from-[#195de6]/10 to-[#195de6]/5 border border-[#195de6]/20 rounded-xl p-6 text-center">
              <Briefcase className="h-12 w-12 text-[#195de6] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0e121b] dark:text-white mb-2">Placement Cell</h3>
              <p className="text-sm text-[#4e6797] dark:text-gray-400">Active placement support</p>
            </div>
            <div className="bg-gradient-to-br from-[#195de6]/10 to-[#195de6]/5 border border-[#195de6]/20 rounded-xl p-6 text-center">
              <GraduationCap className="h-12 w-12 text-[#195de6] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0e121b] dark:text-white mb-2">Quality Education</h3>
              <p className="text-sm text-[#4e6797] dark:text-gray-400">Industry-aligned curriculum</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-gradient-to-r from-[#195de6] to-[#1e40af] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Technical Journey?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
                Join Maner Pvt ITI and take the first step towards a successful career in technical trades. Apply now and secure your future!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/apply-admission"
                  className="bg-white text-[#195de6] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Apply Online Now <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/trades"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Explore Trades <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
