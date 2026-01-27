import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Settings, Clock, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { getTrades } from '../services/api';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await getTrades();
      // Handle both array response and object with data property
      const tradesData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data || []);
      setTrades(tradesData);
      
      if (tradesData.length === 0) {
        console.warn('No trades found in response');
      } else {
        console.log(`Successfully fetched ${tradesData.length} trades`);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch trades';
      console.error('Error details:', error.response?.data || error.message);
      
      // Set empty array on error so page still renders
      setTrades([]);
      
      // Show user-friendly error message (optional - can be enhanced with toast notifications)
      if (error.response?.status === 404) {
        console.warn('Trades endpoint not found. Please ensure the server is running.');
      } else if (error.response?.status >= 500) {
        console.error('Server error. Please try again later.');
      } else if (!error.response) {
        console.error('Network error. Please check your connection and ensure the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (slug) => {
    if (slug === 'electrician') return Zap;
    if (slug === 'fitter') return Settings;
    return Settings;
  };

  const getColor = (slug) => {
    if (slug === 'electrician') return 'from-yellow-500 to-orange-500';
    if (slug === 'fitter') return 'from-blue-500 to-cyan-500';
    return 'from-gray-500 to-gray-600';
  };

  const totalSeats = trades.reduce((sum, trade) => {
    const seats = parseInt(trade.seats.match(/\d+/)?.[0] || 0);
    return sum + seats;
  }, 0);

  if (loading) {
    return (
      <div className="py-8 px-4 lg:px-20">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Loading trades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#195de6] font-bold text-sm uppercase tracking-widest">NCVT Certified Programs</span>
          <h1 className="text-[#0e121b] dark:text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight mt-2 mb-4">
            Trades & Courses
          </h1>
          <div className="w-24 h-1 bg-[#195de6] mx-auto mb-4"></div>
          <p className="text-[#4e6797] dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Choose from our range of government-recognized technical courses designed to prepare you for a successful career in various industries.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#195de6]">{trades.length}</p>
            <p className="text-sm text-[#4e6797] dark:text-gray-400">Total Trades</p>
          </div>
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#195de6]">{totalSeats}</p>
            <p className="text-sm text-[#4e6797] dark:text-gray-400">Total Seats</p>
          </div>
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#195de6]">100%</p>
            <p className="text-sm text-[#4e6797] dark:text-gray-400">Placement Support</p>
          </div>
          <div className="bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-[#195de6]">NCVT</p>
            <p className="text-sm text-[#4e6797] dark:text-gray-400">Certified</p>
          </div>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.length > 0 ? (
            trades.map((trade) => {
              const Icon = getIcon(trade.slug);
              const color = getColor(trade.slug);
              return (
                <Link 
                  key={trade.id} 
                  to={`/trades/${trade.slug}`}
                  className="group bg-white dark:bg-[#1c222d] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {trade.image ? (
                      <img 
                        src={trade.image} 
                        alt={trade.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#195de6] to-[#1e40af] flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60`}></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-[#0e121b] text-xs font-bold px-3 py-1 rounded-full">
                        {trade.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-white text-2xl font-bold drop-shadow-lg">{trade.name}</h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-[#4e6797] dark:text-gray-400 text-sm mb-4 line-clamp-2">{trade.description}</p>
                    
                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Clock className="h-4 w-4 text-[#195de6] mb-1" />
                        <span className="text-xs text-[#4e6797] dark:text-gray-400">Duration</span>
                        <span className="text-sm font-semibold text-[#0e121b] dark:text-white">{trade.duration}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <GraduationCap className="h-4 w-4 text-[#195de6] mb-1" />
                        <span className="text-xs text-[#4e6797] dark:text-gray-400">Eligibility</span>
                        <span className="text-sm font-semibold text-[#0e121b] dark:text-white">{trade.eligibility}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Users className="h-4 w-4 text-[#195de6] mb-1" />
                        <span className="text-xs text-[#4e6797] dark:text-gray-400">Seats</span>
                        <span className="text-sm font-semibold text-[#0e121b] dark:text-white">{trade.seats}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-[#195de6] font-semibold text-sm">View Details</span>
                      <div className="size-8 rounded-full bg-[#195de6]/10 flex items-center justify-center group-hover:bg-[#195de6] transition-colors">
                        <ArrowRight className="h-4 w-4 text-[#195de6] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No trades available</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#195de6] to-[#1e40af] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Not Sure Which Trade to Choose?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Our counselors can help you select the right trade based on your interests, aptitude, and career goals. Get personalized guidance today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="bg-white text-[#195de6] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Talk to Counselor
              </Link>
              <Link 
                to="/apply-admission"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trades;
