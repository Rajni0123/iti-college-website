import { useEffect, useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { getNotices } from '../services/api';
import toast from 'react-hot-toast';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await getNotices();
      setNotices(response.data);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notice Board</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Stay updated with latest announcements and notices</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading notices...</div>
        ) : notices.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {notices.map((notice) => (
              <div key={notice.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(notice.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {notice.pdf && (
                    <a
                      href={`${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${notice.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Download PDF</span>
                    </a>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-3">{notice.title}</h2>
                <p className="text-gray-700 leading-relaxed">{notice.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No notices available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
