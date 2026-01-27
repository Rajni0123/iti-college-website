import { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { getResults } from '../services/api';
import toast from 'react-hot-toast';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTrade, setFilterTrade] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await getResults();
      setResults(response.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const trades = ['Electrician', 'Fitter', 'Welder', 'Mechanic'];
  const years = ['2024', '2023', '2022', '2021'];

  const filteredResults = results.filter((result) => {
    if (filterTrade && result.trade !== filterTrade) return false;
    if (filterYear && result.year !== filterYear) return false;
    return true;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Results</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">View and download examination results</p>
        </div>

        {/* Filters */}
        <div className="card mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold">Filter Results</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Trade</label>
              <select
                value={filterTrade}
                onChange={(e) => setFilterTrade(e.target.value)}
                className="input-field"
              >
                <option value="">All Trades</option>
                {trades.map((trade) => (
                  <option key={trade} value={trade}>
                    {trade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-12">Loading results...</div>
        ) : filteredResults.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="card flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">{result.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Trade: {result.trade}</span>
                    <span>Year: {result.year}</span>
                  </div>
                </div>
                {result.pdf && (
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${result.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
