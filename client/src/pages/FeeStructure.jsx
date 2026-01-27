import { useState, useEffect } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { getFeeStructurePdfInfo } from '../services/api';

const FeeStructure = () => {
  const [pdfInfo, setPdfInfo] = useState({ exists: false });
  const [loading, setLoading] = useState(true);

  const feeData = [
    { trade: 'Electrician', duration: '2 Years', fee: '₹5,000', annual: '₹2,500' },
    { trade: 'Fitter', duration: '2 Years', fee: '₹5,000', annual: '₹2,500' },
  ];

  useEffect(() => {
    fetchPdfInfo();
  }, []);

  const fetchPdfInfo = async () => {
    try {
      const response = await getFeeStructurePdfInfo();
      setPdfInfo(response.data);
    } catch (error) {
      console.error('Error fetching PDF info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${API_URL}/settings/fee-structure/download`, '_blank');
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Fee Structure</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Transparent fee structure for all trades</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="px-6 py-4 text-left">Trade</th>
                    <th className="px-6 py-4 text-left">Duration</th>
                    <th className="px-6 py-4 text-left">Total Fee</th>
                    <th className="px-6 py-4 text-left">Annual Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {feeData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="px-6 py-4 font-semibold">{item.trade}</td>
                      <td className="px-6 py-4">{item.duration}</td>
                      <td className="px-6 py-4">{item.fee}</td>
                      <td className="px-6 py-4">{item.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-yellow-50 border border-yellow-200">
            <h3 className="font-bold mb-2">Additional Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Fee can be paid in installments</li>
              <li>• SC/ST candidates may be eligible for fee waiver (as per government rules)</li>
              <li>• Examination fee is separate and will be notified before exams</li>
              <li>• Refund policy: As per government guidelines</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            {loading ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg text-gray-500">
                Loading...
              </div>
            ) : pdfInfo.exists ? (
              <button 
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#195de6] text-white rounded-lg font-bold hover:bg-[#1e40af] transition-colors"
              >
                <Download className="h-5 w-5" />
                Download Fee Structure PDF
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                Fee Structure PDF not available yet
              </div>
            )}
            {pdfInfo.exists && pdfInfo.updated_at && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(pdfInfo.updated_at).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;
