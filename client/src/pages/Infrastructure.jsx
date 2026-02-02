import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Wrench, Monitor, Zap, Wifi, BookOpen,
  Image as ImageIcon, X, ChevronLeft, ChevronRight, ArrowRight
} from 'lucide-react';
import { getGallery } from '../services/api';
import toast from 'react-hot-toast';

const Infrastructure = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await getGallery();
      setGallery(response.data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const facilities = [
    {
      title: 'Electrical Lab',
      description: 'Fully equipped laboratory with modern testing instruments, safety equipment, and hands-on training modules for electrical systems.',
      icon: Zap,
    },
    {
      title: 'Mechanical Workshop',
      description: 'State-of-the-art workshop with lathe machines, drilling machines, grinding tools, and precision measurement instruments.',
      icon: Wrench,
    },
    {
      title: 'Welding Section',
      description: 'Dedicated welding area equipped with arc welding, gas welding, MIG/TIG welding machines for practical training.',
      icon: Building2,
    },
    {
      title: 'Computer Lab',
      description: 'Modern computer lab with latest systems, high-speed internet connectivity for technical training and documentation.',
      icon: Monitor,
    },
    {
      title: 'Library',
      description: 'Well-stocked library with technical books, journals, reference materials, and digital learning resources.',
      icon: BookOpen,
    },
    {
      title: 'Smart Classroom',
      description: 'Wi-Fi enabled classrooms with projectors and digital boards for interactive and modern teaching methodology.',
      icon: Wifi,
    },
  ];

  const categories = ['All', ...new Set(gallery.map(item => item.category))];
  const filteredGallery = filter === 'All' ? gallery : gallery.filter(item => item.category === filter);

  const getImageUrl = (image) => {
    return `${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${image}`;
  };

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const prevImage = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + filteredGallery.length) % filteredGallery.length }));
  const nextImage = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % filteredGallery.length }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-[#195de6] text-white py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#195de6] to-[#1e40af]"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full"></div>
        <div className="max-w-[1280px] mx-auto relative z-10 text-center">
          <span className="text-white/70 font-semibold text-xs uppercase tracking-widest mb-3 block">Our Campus</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Infrastructure & Facilities</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">Modern facilities designed to provide the best technical education and practical training experience</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: '6+', label: 'Workshops & Labs' },
            { value: '50+', label: 'Machines & Tools' },
            { value: '10k+', label: 'Sq.Ft Campus' },
            { value: '100%', label: 'Practical Training' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 text-center shadow-sm">
              <p className="text-xl sm:text-2xl font-bold text-[#195de6]">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Facilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Our World-Class Facilities</h2>
          <div className="w-16 h-0.5 bg-[#195de6] mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">Every facility is designed to give students real-world, hands-on experience</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-[#195de6]/5 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#195de6] transition-colors">
                  <Icon className="h-5 w-5 text-[#195de6] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{facility.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{facility.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[#195de6] font-semibold text-xs uppercase tracking-widest">Gallery</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Campus Gallery</h2>
            <div className="w-16 h-0.5 bg-[#195de6] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">Take a visual tour of our campus and facilities</p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === cat
                      ? 'bg-[#195de6] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#195de6] mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Loading gallery...</p>
            </div>
          ) : filteredGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredGallery.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/40 transition-colors flex items-end">
                    <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-semibold">{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400 text-sm">No gallery images available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.open && filteredGallery.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <X className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 sm:left-4 text-white/70 hover:text-white p-2">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 sm:right-4 text-white/70 hover:text-white p-2">
            <ChevronRight className="h-8 w-8" />
          </button>
          <img
            src={getImageUrl(filteredGallery[lightbox.index].image)}
            alt={filteredGallery[lightbox.index].category}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-center text-white/60 text-xs">
            {lightbox.index + 1} / {filteredGallery.length} &mdash; {filteredGallery[lightbox.index].category}
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12 sm:py-16">
        <div className="bg-[#195de6] rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Experience Our Campus</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm sm:text-base">Visit us to see our world-class infrastructure and meet our experienced faculty</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/apply-admission" className="bg-white text-[#195de6] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-1.5">
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Infrastructure;
