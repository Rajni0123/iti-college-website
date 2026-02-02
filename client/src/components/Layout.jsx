import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, School, Phone, Mail, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getHeaderSettings, getFooterSettings, getMenus } from '../services/api';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [navMenus, setNavMenus] = useState([]);
  const [headerData, setHeaderData] = useState({
    phone: '+91-9155401839',
    email: 'manerpvtiti@gmail.com',
    student_portal_link: '#',
    student_portal_text: 'Student Portal',
    ncvt_mis_link: 'https://ncvtmis.gov.in',
    ncvt_mis_text: 'NCVT MIS',
    staff_email_link: '#',
    staff_email_text: 'Staff Email',
    logo_text: 'Maner Pvt ITI',
    tagline: 'Skill India | Digital India'
  });
  const [footerData, setFooterData] = useState({
    about_text: 'A premier private institute for vocational training, committed to creating skilled manpower for the modern industrial era with industry-aligned courses.',
    facebook_link: '#',
    twitter_link: '#',
    linkedin_link: '#',
    youtube_link: '#',
    address: 'Maner, Mahinawan, Near Vishwakarma Mandir, Maner, Patna - 801108',
    phone: '+91-9155401839',
    email: 'manerpvtiti@gmail.com',
    copyright_text: '© 2024 Maner Pvt ITI. All Rights Reserved.',
    privacy_link: '#',
    terms_link: '#'
  });
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    fetchHeaderData();
    fetchFooterData();
    fetchNavMenus();
  }, []);

  const fetchNavMenus = async () => {
    try {
      const response = await getMenus();
      // Filter only active menus and sort by order_index
      const activeMenus = (response.data || [])
        .filter(menu => menu.is_active === 1)
        .sort((a, b) => a.order_index - b.order_index);
      setNavMenus(activeMenus);
    } catch (error) {
      console.error('Error fetching navigation menus:', error);
    }
  };

  const fetchHeaderData = async () => {
    try {
      const response = await getHeaderSettings();
      if (response.data && Object.keys(response.data).length > 0) {
        setHeaderData(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching header data:', error);
    }
  };

  const fetchFooterData = async () => {
    try {
      const response = await getFooterSettings();
      if (response.data?.settings && Object.keys(response.data.settings).length > 0) {
        setFooterData(prev => ({ ...prev, ...response.data.settings }));
      }
      if (response.data?.links) {
        setFooterLinks(response.data.links);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Group footer links by category
  const quickLinks = footerLinks.filter(link => link.category === 'quick_links');
  const govtPortals = footerLinks.filter(link => link.category === 'govt_portals');

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 font-display">
      <div className="max-w-[1400px] mx-auto bg-white dark:bg-[#0e121b] shadow-2xl min-h-screen flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-[#195de6] text-white py-2 px-4 md:px-10 lg:px-20 flex justify-between items-center text-xs font-medium border-b border-[#195de6]/20">
        <div className="flex items-center gap-6">
          <a href={`tel:${headerData.phone}`} className="flex items-center gap-1 hover:underline">
            <Phone className="h-3 w-3" /> {headerData.phone}
          </a>
          <a href={`mailto:${headerData.email}`} className="flex items-center gap-1 hover:underline">
            <Mail className="h-3 w-3" /> {headerData.email}
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a className="hover:underline" href={headerData.student_portal_link}>{headerData.student_portal_text}</a>
          <span className="font-semibold">PR CODE: PR10001156</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#111621]/95 backdrop-blur-md border-b border-solid border-b-[#e7ebf3] px-4 md:px-10 lg:px-20 py-3">
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link to="/" className="flex items-center gap-4">
            <div className="size-10 bg-[#195de6] rounded-lg flex items-center justify-center text-white">
              <School className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-[#195de6] text-xl font-bold leading-tight tracking-tight uppercase">{headerData.logo_text}</h1>
              <p className="text-[10px] text-[#4e6797] font-semibold uppercase tracking-widest">{headerData.tagline}</p>
            </div>
          </Link>
          <nav className="hidden xl:flex items-center gap-6">
            {navMenus.length > 0 ? (
              // Dynamic menus from database
              navMenus.map((menu) => {
                // Check if it's an external link
                const isExternal = menu.url.startsWith('http://') || menu.url.startsWith('https://');
                
                if (isExternal) {
                  return (
                    <a
                      key={menu.id}
                      href={menu.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium leading-normal transition-colors text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]"
                    >
                      {menu.title}
                    </a>
                  );
                }
                
                return (
                  <Link 
                    key={menu.id}
                    to={menu.url}
                    className={`text-sm font-medium leading-normal transition-colors ${
                      isActive(menu.url) 
                        ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                    }`}
                  >
                    {menu.title}
                  </Link>
                );
              })
            ) : (
              // Default fallback menus when database is empty
              <>
                <Link 
                  to="/" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/about') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/trades" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/trades') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Trades
                </Link>
                <Link 
                  to="/admission-process" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/admission-process') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Admission
                </Link>
                <Link 
                  to="/results" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/results') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Results
                </Link>
                <Link 
                  to="/faculty" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/faculty') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Faculty
                </Link>
                <Link 
                  to="/infrastructure" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/infrastructure') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Gallery
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-sm font-medium leading-normal transition-colors ${
                    isActive('/contact') 
                      ? 'text-[#195de6] font-bold border-b-2 border-[#195de6] pb-1' 
                      : 'text-[#4e6797] dark:text-gray-300 hover:text-[#195de6]'
                  }`}
                >
                  Contact
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-4">
            {/* NCVT and ITI/Skill India Logos */}
            <div className="hidden md:flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="NCVT - Government of India" 
                className="h-12 w-auto object-contain"
              />
              <img 
                src="https://www.skillindiadigital.gov.in/assets/new-ux-img/skill-india-big-logo.svg" 
                alt="Skill India - Kaushal Bharat" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <button 
              className="xl:hidden text-[#0e121b] dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2 pt-4">
              {navMenus.length > 0 ? (
                // Dynamic menus from database
                navMenus.map((menu) => {
                  const isExternal = menu.url.startsWith('http://') || menu.url.startsWith('https://');
                  
                  if (isExternal) {
                    return (
                      <a
                        key={menu.id}
                        href={menu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {menu.title}
                      </a>
                    );
                  }
                  
                  return (
                    <Link 
                      key={menu.id}
                      to={menu.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(menu.url) 
                          ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                          : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {menu.title}
                    </Link>
                  );
                })
              ) : (
                // Default fallback menus when database is empty
                <>
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/about') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    About
                  </Link>
                  <Link 
                    to="/trades" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/trades') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Trades
                  </Link>
                  <Link 
                    to="/admission-process" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admission-process') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Admission
                  </Link>
                  <Link 
                    to="/results" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/results') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Results
                  </Link>
                  <Link 
                    to="/faculty" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/faculty') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Faculty
                  </Link>
                  <Link 
                    to="/infrastructure" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/infrastructure') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Gallery
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/contact') 
                        ? 'bg-[#195de6]/10 text-[#195de6] font-bold' 
                        : 'text-[#4e6797] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Contact
                  </Link>
                </>
              )}
              {/* NCVT and ITI/Skill India Logos in mobile menu */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                  alt="NCVT - Government of India" 
                  className="h-10 w-auto object-contain"
                />
                <img 
                  src="https://www.skillindiadigital.gov.in/assets/new-ux-img/skill-india-big-logo.svg" 
                  alt="Skill India - Kaushal Bharat" 
                  className="h-10 w-auto object-contain"
                />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0e121b] text-white py-16 px-4 lg:px-20 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 bg-[#195de6] rounded flex items-center justify-center">
                <School className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight">{headerData.logo_text}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {footerData.about_text}
            </p>
            <div className="flex gap-4">
              <a className="size-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#195de6] transition-colors" href={footerData.facebook_link} target="_blank" rel="noopener noreferrer">
                <span className="text-sm">f</span>
              </a>
              <a className="size-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#195de6] transition-colors" href={footerData.twitter_link} target="_blank" rel="noopener noreferrer">
                <span className="text-sm">t</span>
              </a>
              <a className="size-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#195de6] transition-colors" href={footerData.linkedin_link} target="_blank" rel="noopener noreferrer">
                <span className="text-sm">in</span>
              </a>
              <a className="size-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#195de6] transition-colors" href={footerData.youtube_link} target="_blank" rel="noopener noreferrer">
                <span className="text-sm">yt</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#195de6] pl-3">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {quickLinks.length > 0 ? (
                quickLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> {link.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link to="/student-dashboard" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> Student Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/prospectus" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> Download Prospectus
                    </Link>
                  </li>
                  <li>
                    <Link to="/placement" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> Placement Cell
                    </Link>
                  </li>
                  <li>
                    <Link to="/rti" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> RTI Information
                    </Link>
                  </li>
                  <li>
                    <Link to="/grievance" className="hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> Grievance Redressal
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#195de6] pl-3">Govt. Portals</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {govtPortals.length > 0 ? (
                govtPortals.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      {link.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="https://ncvtmis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      NCVT MIS Portal
                    </a>
                  </li>
                  <li>
                    <a href="https://dgt.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      DGT Official Website
                    </a>
                  </li>
                  <li>
                    <a href="https://skillindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      Skill India Mission
                    </a>
                  </li>
                  <li>
                    <a href="https://nats.education.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      NATS Apprentice Portal
                    </a>
                  </li>
                  <li>
                    <a href="https://nsdcindia.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                      NSDC Official
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#195de6] pl-3">Contact Us</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-[#195de6] flex-shrink-0" />
                <p>{footerData.address}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-[#195de6] flex-shrink-0" />
                <p>{footerData.phone}</p>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-[#195de6] flex-shrink-0" />
                <p>{footerData.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>{footerData.copyright_text}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-white" href={footerData.privacy_link}>Privacy Policy</a>
            <a className="hover:text-white" href={footerData.terms_link}>Terms of Service</a>
            <a className="hover:text-white" href="#">Website Accessibility</a>
          </div>
        </div>
      </footer>
      {/* Floating Call Button - Bottom Left */}
      <a
        href={`tel:${footerData.phone?.replace(/[^0-9+]/g, '') || '+919155401839'}`}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#195de6] rounded-full flex items-center justify-center shadow-lg shadow-[#195de6]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#195de6]/40 transition-all duration-300 group"
        aria-label="Call us"
      >
        <Phone className="h-6 w-6 text-white group-hover:animate-pulse" />
        <span className="absolute left-full ml-3 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Now
        </span>
      </a>

      {/* Floating WhatsApp Button - Bottom Right */}
      <a
        href={`https://wa.me/91${(footerData.phone || '9155401839').replace(/[^0-9]/g, '').slice(-10)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 group"
        aria-label="WhatsApp us"
      >
        <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp
        </span>
      </a>
      </div>
    </div>
  );
};

export default Layout;
