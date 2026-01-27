import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ 
  heroData, 
  isPreview = false 
}) => {
  const defaultData = {
    title: 'Shape Your Future With Technical Excellence.',
    subtitle: 'ADMISSION OPEN 2024-25',
    description: "Join the region's leading private ITI to master high-demand technical skills and get 100% placement assistance.",
    background_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdxCMlJMLVeJ6DemcOw2AIihGbiepX5MPWU8r750l9Vi7pmoTzGVhz-NKXuc0hRLtAOeE2CZfns5-KQWaN0o2jpL8zRMJ1F89VY4gQ1ZRt4NphdCl-E5D7SwEf22H9m9gjfOqbWYea0KCzyZ-fxa4KlT9Go5DizC2onmz_rywidkbWavMPS_UfzoIviQGKr7k5bwI46H13I34QQp4Z9JggtUXLiUm-Wl23DEPPI7_Jcr28lI7YfGgXmL23AqXcG5UU1n0O1njDu__y',
    cta_text: 'Apply Online Now',
    cta_link: '/apply-admission',
    cta2_text: 'Explore Trades',
    cta2_link: '/trades'
  };

  const data = { ...defaultData, ...heroData };

  // Preview mode for admin panel (smaller size)
  if (isPreview) {
    return (
      <div className="relative overflow-hidden rounded-xl h-[300px] shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: data.background_image 
              ? `linear-gradient(rgba(14, 18, 27, 0.7), rgba(14, 18, 27, 0.2)), url("${data.background_image}")`
              : 'linear-gradient(rgba(14, 18, 27, 0.7), rgba(14, 18, 27, 0.2)), linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        ></div>
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10 max-w-[600px]">
          {data.subtitle && (
            <div className="inline-flex items-center bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-bold mb-4 animate-pulse w-fit">
              {data.subtitle}
            </div>
          )}
          <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 tracking-tighter">
            {data.title}
          </h1>
          <p className="text-white/90 text-sm md:text-base font-normal mb-6 leading-relaxed line-clamp-2">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              className="bg-[#195de6] text-white h-10 px-6 rounded-lg font-semibold text-sm hover:bg-[#1e40af] transition-colors shadow-lg shadow-[#195de6]/30 flex items-center gap-2"
            >
              {data.cta_text} <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white h-10 px-6 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              {data.cta2_text}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full size for frontend
  return (
    <div className="px-4 lg:px-20 py-6">
      <div className="relative overflow-hidden rounded-xl h-[500px] shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `linear-gradient(rgba(14, 18, 27, 0.7), rgba(14, 18, 27, 0.2)), url("${data.background_image}")`
          }}
        ></div>
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-[800px]">
          {data.subtitle && (
            <div className="inline-flex items-center bg-[#ef4444] text-white px-3 py-1 rounded-full text-xs font-bold mb-6 animate-pulse">
              {data.subtitle}
            </div>
          )}
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4 tracking-tighter">
            {data.title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-normal mb-8 leading-relaxed">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to={data.cta_link || "/apply-admission"}
              className="bg-[#195de6] text-white h-12 px-8 rounded-lg font-semibold text-lg hover:bg-[#1e40af] transition-colors shadow-lg shadow-[#195de6]/30 flex items-center gap-2"
            >
              {data.cta_text} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to={data.cta2_link || "/trades"}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white h-12 px-8 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors"
            >
              {data.cta2_text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
