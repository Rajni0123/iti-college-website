import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, User, Search, ChevronDown, ChevronLeft, ChevronRight,
  GraduationCap, Clock, Award, AlertCircle
} from 'lucide-react';
import { getAllFaculty, getPrincipal } from '../services/api';

const Faculty = () => {
  const [loading, setLoading] = useState(true);
  const [principal, setPrincipal] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchQuery, selectedDepartment]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [principalRes, facultyRes] = await Promise.all([
        getPrincipal(),
        getAllFaculty()
      ]);
      
      if (principalRes.data.success) {
        setPrincipal(principalRes.data.data);
      }
      
      if (facultyRes.data.success) {
        const nonPrincipalFaculty = facultyRes.data.data.filter(f => !f.is_principal);
        setFaculty(nonPrincipalFaculty);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaculty = () => {
    let filtered = [...faculty];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.designation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by department
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter(f => f.department === selectedDepartment);
    }
    
    setFilteredFaculty(filtered);
  };

  // Get unique departments
  const departments = ['All Departments', ...new Set(faculty.map(f => f.department))];

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

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-50 dark:bg-[#111421]">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10">
        {/* Page Heading */}
        <div className="mb-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-[#0e101b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Our Faculty & Staff
            </h1>
            <p className="text-[#4e5a97] dark:text-gray-400 text-lg max-w-3xl leading-normal">
              Meet the dedicated professionals committed to technical excellence and shaping the next generation of skilled trade experts at ITI College.
            </p>
          </div>
        </div>

        {/* Principal's Spotlight */}
        {principal && (
          <div className="mb-12">
            <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#1a1d2d] shadow-lg border-l-4 border-[#195de6]">
              <div className="flex flex-col md:flex-row items-stretch">
                <div 
                  className="w-full md:w-1/3 bg-center bg-no-repeat bg-cover min-h-[300px]"
                  style={{ backgroundImage: `url(${principal.image})` }}
                ></div>
                <div className="flex flex-1 flex-col justify-center p-8 lg:p-12 gap-4">
                  <div>
                    <span className="bg-[#195de6]/10 text-[#195de6] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
                      Leadership Spotlight
                    </span>
                    <h2 className="text-[#0e101b] dark:text-white text-3xl font-bold">{principal.name}</h2>
                    <p className="text-[#195de6] text-lg font-medium">{principal.designation}</p>
                  </div>
                  {principal.bio && (
                    <div className="space-y-4">
                      <p className="text-[#4e5a97] dark:text-gray-300 italic text-lg leading-relaxed">
                        "{principal.bio}"
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm font-medium">
                        {principal.qualification && (
                          <span className="flex items-center gap-1 text-[#4e5a97] dark:text-gray-400">
                            <GraduationCap className="h-4 w-4 text-[#195de6]" />
                            {principal.qualification}
                          </span>
                        )}
                        {principal.experience && (
                          <span className="flex items-center gap-1 text-[#4e5a97] dark:text-gray-400">
                            <Award className="h-4 w-4 text-[#195de6]" />
                            {principal.experience}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {principal.email && (
                    <div className="pt-4">
                      <a
                        href={`mailto:${principal.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-[#195de6] text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
                      >
                        <Mail className="h-4 w-4" />
                        Contact Office
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="sticky top-20 z-40 bg-gray-50 dark:bg-[#111421] pb-6">
          <div className="flex flex-col md:flex-row gap-4 p-2 bg-white dark:bg-[#1a1d2d] rounded-xl shadow-sm border border-[#e7e9f3] dark:border-gray-800">
            <div className="flex-1 px-4 py-2">
              <label className="flex items-center min-w-40 h-10 w-full">
                <Search className="h-5 w-5 text-[#4e5a97] dark:text-gray-400 mr-3" />
                <input
                  className="flex w-full border-none bg-transparent text-[#0e101b] dark:text-white focus:ring-0 placeholder:text-[#4e5a97] p-0 text-base font-normal outline-none"
                  placeholder="Search faculty by name or designation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="h-auto w-px bg-[#e7e9f3] dark:bg-gray-800 hidden md:block"></div>
            <div className="flex flex-wrap gap-2 p-1">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-[#195de6] text-white'
                      : 'bg-[#f0f2f9] dark:bg-[#252a41] text-[#0e101b] dark:text-gray-300 hover:bg-[#e7e9f3] dark:hover:bg-[#2d334d]'
                  }`}
                >
                  <span>{dept}</span>
                  {dept !== 'All Departments' && <ChevronDown className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1a1d2d] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e7e9f3] dark:border-gray-800 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/5] bg-gray-200">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${member.image || 'https://via.placeholder.com/400x500?text=No+Image'})` }}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-bold uppercase tracking-wider">
                      {member.department}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5 gap-3">
                  <div>
                    <h3 className="text-[#0e101b] dark:text-white text-lg font-bold">{member.name}</h3>
                    <p className="text-[#4e5a97] dark:text-gray-400 text-sm font-medium">{member.designation}</p>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-[#4e5a97] dark:text-gray-300">
                    {member.qualification && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-[#195de6]/70" />
                        <span>{member.qualification}</span>
                      </div>
                    )}
                    {member.experience && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#195de6]/70" />
                        <span>{member.experience}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <div className="flex gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="size-8 flex items-center justify-center rounded-lg bg-[#f0f2f9] dark:bg-[#252a41] text-[#195de6] hover:bg-[#195de6] hover:text-white transition-all"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      <button className="size-8 flex items-center justify-center rounded-lg bg-[#f0f2f9] dark:bg-[#252a41] text-[#195de6] hover:bg-[#195de6] hover:text-white transition-all">
                        <User className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="text-xs font-bold text-[#195de6] hover:underline uppercase tracking-tight">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1a1d2d] rounded-xl border border-[#e7e9f3] dark:border-gray-800">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-[#4e5a97] dark:text-gray-400 opacity-50" />
            <h3 className="text-xl font-bold text-[#0e101b] dark:text-white mb-2">No Faculty Found</h3>
            <p className="text-[#4e5a97] dark:text-gray-400">
              {searchQuery || selectedDepartment !== 'All Departments'
                ? 'Try adjusting your search or filter criteria'
                : 'Faculty information will be available soon'}
            </p>
          </div>
        )}

        {/* Footer Pagination */}
        {filteredFaculty.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button className="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-[#1a1d2d] border border-[#e7e9f3] dark:border-gray-800 text-[#4e5a97] hover:bg-[#195de6] hover:text-white transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg bg-[#195de6] text-white border border-[#195de6] font-bold">
              1
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-[#1a1d2d] border border-[#e7e9f3] dark:border-gray-800 text-[#4e5a97] hover:bg-[#195de6] hover:text-white transition-all">
              2
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-[#1a1d2d] border border-[#e7e9f3] dark:border-gray-800 text-[#4e5a97] hover:bg-[#195de6] hover:text-white transition-all">
              3
            </button>
            <button className="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-[#1a1d2d] border border-[#e7e9f3] dark:border-gray-800 text-[#4e5a97] hover:bg-[#195de6] hover:text-white transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Faculty;
