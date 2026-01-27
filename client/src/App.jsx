import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Trades from './pages/Trades';
import TradeDetail from './pages/TradeDetail';
import AdmissionProcess from './pages/AdmissionProcess';
import ApplyAdmission from './pages/ApplyAdmission';
import FeeStructure from './pages/FeeStructure';
import Faculty from './pages/Faculty';
import Infrastructure from './pages/Infrastructure';
import NoticeBoard from './pages/NoticeBoard';
import Results from './pages/Results';
import Contact from './pages/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminNotices from './admin/AdminNotices';
import AdminResults from './admin/AdminResults';
import AdminGallery from './admin/AdminGallery';
import Admissions from './admin/Admissions';
import Staff from './admin/Staff';
import Students from './admin/Students';
import Sessions from './admin/Sessions';
import AdminSettings from './admin/AdminSettings';
import MenuManagement from './admin/MenuManagement';
import CategoryManagement from './admin/CategoryManagement';
import FlashNewsManagement from './admin/FlashNewsManagement';
import HeroManagement from './admin/HeroManagement';
import ProfileManagement from './admin/ProfileManagement';
import FeeManagement from './admin/FeeManagement';
import HeaderFooterManagement from './admin/HeaderFooterManagement';
import TradeManagement from './admin/TradeManagement';
import AboutManagement from './admin/AboutManagement';
import AdmissionProcessManagement from './admin/AdmissionProcessManagement';
import FacultyManagement from './admin/FacultyManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <SEOHead />
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="trades" element={<Trades />} />
          <Route path="trades/:tradeId" element={<TradeDetail />} />
          <Route path="admission-process" element={<AdmissionProcess />} />
          <Route path="apply-admission" element={<ApplyAdmission />} />
          <Route path="fee-structure" element={<FeeStructure />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="notices" element={<NoticeBoard />} />
          <Route path="results" element={<Results />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="staff" element={<Staff />} />
          <Route path="students" element={<Students />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="flash-news" element={<FlashNewsManagement />} />
          <Route path="hero" element={<HeroManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="header-footer" element={<HeaderFooterManagement />} />
          <Route path="trades" element={<TradeManagement />} />
          <Route path="about" element={<AboutManagement />} />
          <Route path="admission-process" element={<AdmissionProcessManagement />} />
          <Route path="faculty" element={<FacultyManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
