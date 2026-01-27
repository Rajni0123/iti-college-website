import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Image as ImageIcon,
  Megaphone,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  GraduationCap,
  Briefcase,
  Activity,
  RefreshCw,
  ArrowRight,
  Calendar,
  Bell,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalNotices: 0,
    noticesThisWeek: 0,
    totalResults: 0,
    resultsThisWeek: 0,
    lastResultUpdate: null,
    galleryPhotos: 0,
    galleryThisWeek: 0,
    pendingAdmissions: 0,
    approvedAdmissions: 0,
    rejectedAdmissions: 0,
    totalAdmissions: 0,
    admissionsThisWeek: 0,
    totalFaculty: 0,
    totalTrades: 0,
    recentActivities: [],
    highDuesStudents: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'notice': return <Megaphone className="h-4 w-4 text-[#195de6]" />;
      case 'result': return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'admission': return <UserCheck className="h-4 w-4 text-emerald-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'notice': return 'Notice';
      case 'result': return 'Result';
      case 'admission': return 'Application';
      default: return 'Activity';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#195de6] mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Overview of ITI College administration
            </p>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#195de6]/10 text-[#195de6] rounded-lg hover:bg-[#195de6]/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Notices */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Notices</p>
              <div className="bg-[#195de6]/10 p-2 rounded-lg">
                <Megaphone className="h-5 w-5 text-[#195de6]" />
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              {stats.totalNotices}
            </p>
            <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${stats.noticesThisWeek > 0 ? 'text-green-600' : 'text-slate-400'}`}>
              {stats.noticesThisWeek > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3" /> +{stats.noticesThisWeek} this week
                </>
              ) : (
                'No new notices this week'
              )}
            </p>
          </div>

          {/* Pending Admissions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Admissions</p>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              {stats.pendingAdmissions}
            </p>
            <p className={`text-xs mt-2 font-medium ${stats.pendingAdmissions > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {stats.pendingAdmissions > 0 ? (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Requires attention
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> All processed
                </span>
              )}
            </p>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Exam Results</p>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              {stats.totalResults}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Updated {formatTimeAgo(stats.lastResultUpdate)}
            </p>
          </div>

          {/* Gallery Photos */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gallery Photos</p>
              <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg">
                <ImageIcon className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              {stats.galleryPhotos}
            </p>
            <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${stats.galleryThisWeek > 0 ? 'text-green-600' : 'text-slate-400'}`}>
              {stats.galleryThisWeek > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3" /> +{stats.galleryThisWeek} this week
                </>
              ) : (
                'No new photos this week'
              )}
            </p>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admission Stats Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admission Overview</h3>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.pendingAdmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Approved</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.approvedAdmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Rejected</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.rejectedAdmissions}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Applications</span>
                  <span className="text-lg font-bold text-[#195de6]">{stats.totalAdmissions}</span>
                </div>
                {stats.admissionsThisWeek > 0 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +{stats.admissionsThisWeek} new this week
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Stats</h3>
              <Activity className="h-5 w-5 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                <Users className="h-6 w-6 mx-auto text-[#195de6] mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalFaculty}</p>
                <p className="text-xs text-slate-500">Faculty Members</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                <GraduationCap className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTrades}</p>
                <p className="text-xs text-slate-500">Active Trades</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getActivityLabel(activity.type)} • {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Students with High Dues Alert */}
        {stats.highDuesStudents && stats.highDuesStudents.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-3 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-400">High Dues Alert</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">Students with more than 50% pending dues</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/students')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
              >
                View All Students
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.highDuesStudents.slice(0, 6).map((student) => {
                const duesPercentage = student.total_dues > 0 
                  ? ((student.total_paid / student.total_dues) * 100).toFixed(1)
                  : 0;
                const pendingAmount = student.total_dues - student.total_paid;
                
                return (
                  <div
                    key={student.id}
                    className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white text-base">{student.student_name}</p>
                        {student.trade && (
                          <p className="text-xs text-slate-500 mt-0.5">{student.trade}</p>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold">
                        {duesPercentage}% Paid
                      </span>
                    </div>
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Mobile:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">{student.mobile || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Total Dues:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">₹{student.total_dues?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Pending:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">₹{pendingAmount?.toLocaleString() || 0}</span>
                      </div>
                      {student.last_paid_amount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Last Paid:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">₹{student.last_paid_amount?.toLocaleString()}</span>
                        </div>
                      )}
                      {student.last_payment_date && (
                        <p className="text-xs text-slate-500 mt-1">
                          Last payment: {new Date(student.last_payment_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/admin/fees?search=${student.student_name}`)}
                      className="w-full mt-3 px-3 py-2 bg-[#195de6] text-white rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-colors"
                    >
                      View Fee Details
                    </button>
                  </div>
                );
              })}
            </div>
            {stats.highDuesStudents.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/admin/students')}
                  className="text-sm font-semibold text-red-700 dark:text-red-400 hover:underline"
                >
                  View {stats.highDuesStudents.length - 6} more students with high dues →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/admin/notices')}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#195de6]/20 hover:bg-[#195de6]/5 hover:border-[#195de6]/40 transition-all text-left group"
            >
              <div className="bg-[#195de6]/10 p-3 rounded-xl group-hover:bg-[#195de6] transition-colors">
                <Megaphone className="h-6 w-6 text-[#195de6] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">Post Notice</p>
                <p className="text-xs text-slate-500">Publish announcement</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#195de6] transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/admin/results')}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-indigo-500/20 hover:bg-indigo-500/5 hover:border-indigo-500/40 transition-all text-left group"
            >
              <div className="bg-indigo-500/10 p-3 rounded-xl group-hover:bg-indigo-500 transition-colors">
                <FileText className="h-6 w-6 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">Upload Results</p>
                <p className="text-xs text-slate-500">Add exam results</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/admin/admissions')}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-500/20 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all text-left group"
            >
              <div className="bg-emerald-500/10 p-3 rounded-xl group-hover:bg-emerald-500 transition-colors">
                <UserCheck className="h-6 w-6 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">Review Admissions</p>
                <p className="text-xs text-slate-500">
                  {stats.pendingAdmissions > 0 ? `${stats.pendingAdmissions} pending` : 'Process applications'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button 
              onClick={() => navigate('/admin/gallery')}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-rose-500/20 hover:bg-rose-500/5 hover:border-rose-500/40 transition-all text-left group"
            >
              <div className="bg-rose-500/10 p-3 rounded-xl group-hover:bg-rose-500 transition-colors">
                <ImageIcon className="h-6 w-6 text-rose-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">Manage Gallery</p>
                <p className="text-xs text-slate-500">Upload photos</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/faculty')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <Users className="h-8 w-8 mx-auto text-slate-400 group-hover:text-[#195de6] transition-colors mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Faculty</p>
          </button>
          <button 
            onClick={() => navigate('/admin/students')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <GraduationCap className="h-8 w-8 mx-auto text-slate-400 group-hover:text-[#195de6] transition-colors mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Students</p>
          </button>
          <button 
            onClick={() => navigate('/admin/trades')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <Briefcase className="h-8 w-8 mx-auto text-slate-400 group-hover:text-[#195de6] transition-colors mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Trades</p>
          </button>
          <button 
            onClick={() => navigate('/admin/about')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
          >
            <FileText className="h-8 w-8 mx-auto text-slate-400 group-hover:text-[#195de6] transition-colors mb-2" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">About Page</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
