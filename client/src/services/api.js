import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Check for admin token first, then regular token
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  const authToken = adminToken || token;
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Public APIs
export const getNotices = () => api.get('/notices');
export const getNotice = (id) => api.get(`/notices/${id}`);
export const getResults = () => api.get('/results');
export const getGallery = () => api.get('/gallery');
export const submitContact = (data) => api.post('/contact', data);
export const applyAdmission = (formData) => api.post('/admissions', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Admin APIs
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getDashboardStats = () => api.get('/admin/stats');
export const createNotice = (data) => api.post('/admin/notices', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateNotice = (id, data) => api.put(`/admin/notices/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteNotice = (id) => api.delete(`/admin/notices/${id}`);
export const createResult = (data) => api.post('/admin/results', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteResult = (id) => api.delete(`/admin/results/${id}`);
export const uploadGalleryImage = (formData) => api.post('/admin/gallery', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteGalleryImage = (id) => api.delete(`/admin/gallery/${id}`);
export const getAdmissions = (page = 1, filters = {}) => {
  const params = { page, ...filters };
  return api.get('/admin/admissions', { params });
};
export const createManualAdmission = (data) => api.post('/admin/admissions/manual', data);
export const updateAdmissionStatus = (dbId, status) => api.put(`/admin/admissions/${dbId}/status`, { status });
export const updateAdmission = (dbId, data) => api.put(`/admin/admissions/${dbId}`, data);
export const downloadDocument = (filename) => api.get(`/admin/admissions/documents/${filename}`, {
  responseType: 'blob',
});

// Menu Management
export const getMenus = () => api.get('/menus');
export const createMenu = (data) => api.post('/menus', data);
export const updateMenu = (id, data) => api.put(`/menus/${id}`, data);
export const deleteMenu = (id) => api.delete(`/menus/${id}`);
export const seedMenus = () => api.post('/menus/seed');

// Category Management
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Hero Section
export const getHero = () => api.get('/hero');
export const getAllHero = () => api.get('/hero/all');
export const createHero = (data) => api.post('/hero', data);
export const updateHero = (id, data) => api.put(`/hero/${id}`, data);
export const deleteHero = (id) => api.delete(`/hero/${id}`);

// Flash News
export const getFlashNews = () => api.get('/flash-news');
export const getAllFlashNews = () => api.get('/flash-news/all');
export const createFlashNews = (data) => api.post('/flash-news', data);
export const updateFlashNews = (id, data) => api.put(`/flash-news/${id}`, data);
export const deleteFlashNews = (id) => api.delete(`/flash-news/${id}`);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.put('/profile/password', data);

// Fees
export const getFees = (filters) => api.get('/fees', { params: filters });
export const getFeeById = (id) => api.get(`/fees/${id}`);
export const getRecentPayments = () => api.get('/fees/recent-payments');
export const createFee = (data) => api.post('/fees', data);
export const updateFee = (id, data) => api.put(`/fees/${id}`, data);
export const payFee = (id, data) => api.post(`/fees/${id}/pay`, data);
export const deleteFee = (id) => api.delete(`/fees/${id}`);

// Header/Footer Settings
export const getHeaderSettings = () => api.get('/site/header');
export const updateHeaderSettings = (data) => api.put('/site/header', data);
export const getFooterSettings = () => api.get('/site/footer');
export const updateFooterSettings = (data) => api.put('/site/footer', data);
export const getAllFooterLinks = () => api.get('/site/footer/links/all');
export const createFooterLink = (data) => api.post('/site/footer/links', data);
export const updateFooterLink = (id, data) => api.put(`/site/footer/links/${id}`, data);
export const deleteFooterLink = (id) => api.delete(`/site/footer/links/${id}`);

// Settings
export const getSettings = () => api.get('/settings');

// Fee Structure PDF
export const getFeeStructurePdfInfo = () => api.get('/settings/fee-structure/info');
export const uploadFeeStructurePdf = (formData) => api.post('/settings/fee-structure/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Favicon
export const getFaviconInfo = () => api.get('/settings/favicon/info');
export const uploadFavicon = (formData) => api.post('/settings/favicon/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Trades Management
export const getTrades = () => api.get('/trades');
export const getTradeBySlug = (slug) => api.get(`/trades/${slug}`);
export const getAllTrades = () => api.get('/trades/admin/all');
export const createTrade = (formData) => api.post('/trades', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateTrade = (id, formData) => api.put(`/trades/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteTrade = (id) => api.delete(`/trades/${id}`);

// About Page Management
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.put('/about', data);

// Admission Process Management
export const getAdmissionProcess = () => api.get('/admission-process');
export const updateAdmissionProcess = (data) => api.put('/admission-process', data);

// Faculty Management
export const getAllFaculty = () => api.get('/faculty');
export const getPrincipal = () => api.get('/faculty/principal');
export const getFacultyByDepartment = (department) => api.get(`/faculty/department/${department}`);
export const getAllFacultyAdmin = () => api.get('/faculty/admin/all');
export const getFacultyById = (id) => api.get(`/faculty/${id}`);
export const createFaculty = (data) => api.post('/faculty', data);
export const updateFaculty = (id, data) => api.put(`/faculty/${id}`, data);
export const deleteFaculty = (id) => api.delete(`/faculty/${id}`);

// Staff Management
export const getAllStaff = () => api.get('/staff');
export const getStaffById = (id) => api.get(`/staff/${id}`);
export const createStaff = (data) => api.post('/staff', data);
export const updateStaff = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
export const getDefaultPermissions = () => api.get('/staff/permissions/default');

// Student Management
export const getAllStudents = (params) => api.get('/students', { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const getStudentsWithHighDues = () => api.get('/students/high-dues');

export default api;
