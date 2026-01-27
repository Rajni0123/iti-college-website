import { Building, Wrench, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGallery } from '../services/api';
import toast from 'react-hot-toast';

const Infrastructure = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

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
      description: 'Fully equipped electrical laboratory with modern equipment and safety measures',
      icon: Building,
    },
    {
      title: 'Mechanical Workshop',
      description: 'State-of-the-art workshop with lathe machines, drilling machines, and tools',
      icon: Wrench,
    },
    {
      title: 'Welding Section',
      description: 'Dedicated welding area with arc welding, gas welding, and modern equipment',
      icon: Wrench,
    },
    {
      title: 'Computer Lab',
      description: 'Computer lab with latest systems for technical training and documentation',
      icon: Building,
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Infrastructure</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Modern facilities for quality technical education</p>
        </div>

        {/* Facilities */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                      <p className="text-gray-700">{facility.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Gallery</h2>
          {loading ? (
            <div className="text-center py-8">Loading gallery...</div>
          ) : gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="card p-0 overflow-hidden">
                  <img
                    src={`${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${item.image}`}
                    alt={item.category}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-semibold">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>No gallery images available</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Infrastructure;
