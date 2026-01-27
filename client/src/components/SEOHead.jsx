import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SEOHead = () => {
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api';

  useEffect(() => {
    // Fetch SEO settings from API
    const updateSEO = async () => {
      try {
        const response = await axios.get(`${apiUrl}/settings`);
        const settings = response.data;

        // Update document title
        if (settings.seo_title) {
          document.title = settings.seo_title;
        }

        // Update or create meta tags
        const updateMetaTag = (name, content, attribute = 'name') => {
          if (!content) return;
          
          let meta = document.querySelector(`meta[${attribute}="${name}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        };

        // Basic SEO
        updateMetaTag('description', settings.seo_description);
        updateMetaTag('keywords', settings.seo_keywords);
        updateMetaTag('author', settings.seo_author);
        updateMetaTag('robots', settings.seo_robots);

        // Open Graph
        updateMetaTag('og:title', settings.seo_og_title || settings.seo_title, 'property');
        updateMetaTag('og:description', settings.seo_og_description || settings.seo_description, 'property');
        updateMetaTag('og:image', settings.seo_og_image, 'property');
        updateMetaTag('og:type', 'website', 'property');
        updateMetaTag('og:url', window.location.href, 'property');

        // Twitter Card
        updateMetaTag('twitter:card', settings.seo_twitter_card);
        updateMetaTag('twitter:title', settings.seo_og_title || settings.seo_title);
        updateMetaTag('twitter:description', settings.seo_og_description || settings.seo_description);
        updateMetaTag('twitter:image', settings.seo_og_image);
        if (settings.seo_twitter_site) {
          updateMetaTag('twitter:site', settings.seo_twitter_site);
        }

        // Google Site Verification
        if (settings.seo_google_site_verification) {
          updateMetaTag('google-site-verification', settings.seo_google_site_verification);
        }

        // Update favicon
        if (settings.favicon) {
          const faviconUrl = `${apiUrl.replace('/api', '')}/uploads/${settings.favicon}`;
          
          // Remove existing favicon links
          const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
          existingFavicons.forEach(link => link.remove());

          // Add new favicon
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = settings.favicon.endsWith('.svg') ? 'image/svg+xml' : 
                     settings.favicon.endsWith('.ico') ? 'image/x-icon' : 'image/png';
          link.href = faviconUrl;
          document.head.appendChild(link);

          // Also add apple-touch-icon for iOS
          const appleLink = document.createElement('link');
          appleLink.rel = 'apple-touch-icon';
          appleLink.href = faviconUrl;
          document.head.appendChild(appleLink);
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    };

    updateSEO();
  }, [location.pathname, apiUrl]);

  return null; // This component doesn't render anything
};

export default SEOHead;
