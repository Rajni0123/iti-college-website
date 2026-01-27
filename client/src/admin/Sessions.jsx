import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Check, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    session_name: '',
    start_year: '',
    end_year: '',
    is_active: 1
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // Check for adminToken first, then fall back to token
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      const authToken = adminToken || token;
      
      if (!authToken) {
        toast.error('Please login to access sessions');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const response = await axios.get(`${apiUrl}/sessions`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for adminToken first, then fall back to token
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      const authToken = adminToken || token;
      
      if (!authToken) {
        toast.error('Please login to save sessions');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      const url = editingSession
        ? `${apiUrl}/sessions/${editingSession.id}`
        : `${apiUrl}/sessions`;

      const method = editingSession ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      toast.success(editingSession ? 'Session updated successfully!' : 'Session created successfully!');
      resetForm();
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save session');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      session_name: session.session_name,
      start_year: session.start_year,
      end_year: session.end_year,
      is_active: session.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      // Check for adminToken first, then fall back to token
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      const authToken = adminToken || token;
      
      if (!authToken) {
        toast.error('Please login to delete sessions');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';
      await axios.delete(`${apiUrl}/sessions/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.success('Session deleted successfully!');
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete session');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      session_name: '',
      start_year: '',
      end_year: '',
      is_active: 1
    });
    setEditingSession(null);
    setShowModal(false);
  };

  const generateSessionName = () => {
    const { start_year, end_year } = formData;
    if (start_year && end_year) {
      setFormData(prev => ({
        ...prev,
        session_name: `${start_year}-${end_year}`
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Session Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage academic sessions (2-year format)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Session
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Session Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Start Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                End Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.session_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {session.start_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {session.end_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {session.is_active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {session.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(session)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No sessions found. Add your first session!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingSession ? 'Edit Session' : 'Add New Session'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.start_year}
                  onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                  onBlur={generateSessionName}
                  placeholder="e.g., 2026"
                  min="2020"
                  max="2100"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Year (2 years later) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.end_year}
                  onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                  onBlur={generateSessionName}
                  placeholder="e.g., 2028"
                  min="2020"
                  max="2100"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Should be 2 years after start year</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Name (Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.session_name}
                  onChange={(e) => setFormData({ ...formData, session_name: e.target.value })}
                  placeholder="e.g., 2026-28"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Session
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingSession ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
