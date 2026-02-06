'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface Platform {
  id: string;
  name: string;
  slug: string;
  location_city: string;
  location_country: string;
  logo_url: string;
}

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  name: string;
  slug: string;
  logo_url: string;
}

// Simple mapping of countries to coordinates
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  'United States': { lat: 37.0902, lng: -95.7129 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'UK': { lat: 55.3781, lng: -3.4360 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Norway': { lat: 60.4720, lng: 8.4689 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Finland': { lat: 61.9241, lng: 25.7482 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Belgium': { lat: 50.5039, lng: 4.4699 },
  'Ireland': { lat: 53.4129, lng: -8.2439 },
  'Portugal': { lat: 39.3999, lng: -8.2245 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Chile': { lat: -35.6751, lng: -71.5430 },
  'Colombia': { lat: 4.5709, lng: -74.2973 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'New Zealand': { lat: -40.9006, lng: 174.8860 },
  'Israel': { lat: 31.0461, lng: 34.8516 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
  'Russia': { lat: 61.5240, lng: 105.3188 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Czech Republic': { lat: 49.8175, lng: 15.4730 },
  'Romania': { lat: 45.9432, lng: 24.9668 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Thailand': { lat: 15.8700, lng: 100.9925 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Philippines': { lat: 12.8797, lng: 121.7740 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
  'Bangladesh': { lat: 23.6850, lng: 90.3563 },
  'Egypt': { lat: 26.8206, lng: 30.8025 },
  'Nigeria': { lat: 9.0820, lng: 8.6753 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
};

export function GlobeView() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [points, setPoints] = useState<GlobePoint[]>([]);
  const globeEl = useRef<any>(null);

  const fetchPlatformsWithLocation = async () => {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name, slug, location_city, location_country, logo_url')
        .eq('approved', true)
        .not('location_country', 'is', null);

      if (error) throw error;
      
      const platformsData = data as unknown as Platform[];
      setPlatforms(platformsData);

      // Convert to globe points using country coordinates
      const globePoints: GlobePoint[] = platformsData
        .filter(platform => COUNTRY_COORDS[platform.location_country])
        .map((platform) => {
          const coords = COUNTRY_COORDS[platform.location_country];
          return {
            lat: coords.lat,
            lng: coords.lng,
            size: 1.8, // Larger size for better visibility
            color: '#06b6d4', // cyan-500
            label: `${platform.name} - ${platform.location_city}, ${platform.location_country}`,
            name: platform.name,
            slug: platform.slug,
            logo_url: platform.logo_url,
          };
        });

      setPoints(globePoints);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  useEffect(() => {
    fetchPlatformsWithLocation();
  }, []);

  useEffect(() => {
    // Auto-rotate the globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-black/20 border border-white/10">
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
        <p className="text-sm text-white/80">
          <span className="font-semibold text-cyan-400">{platforms.length}</span> platforms launched worldwide
        </p>
      </div>
      
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        htmlElementsData={points}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          
          // Create container
          const container = document.createElement('div');
          container.style.cssText = `
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid rgba(6, 182, 212, 0.6);
            box-shadow: 0 0 12px rgba(6, 182, 212, 0.8), 0 0 24px rgba(6, 182, 212, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
            overflow: hidden;
            padding: 2px;
            position: relative;
          `;
          
          // Create image
          const img = document.createElement('img');
          img.src = d.logo_url;
          img.alt = d.name;
          img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          `;
          
          // Fallback if image fails
          img.onerror = () => {
            img.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.style.cssText = `
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #06b6d4;
              box-shadow: 0 0 4px rgba(6, 182, 212, 0.8);
            `;
            container.appendChild(fallback);
          };
          
          container.appendChild(img);
          
          // Create tooltip
          const tooltip = document.createElement('div');
          tooltip.textContent = d.name;
          tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            border: 1px solid rgba(6, 182, 212, 0.6);
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          `;
          document.body.appendChild(tooltip);
          
          // Add animation keyframes
          const style = document.createElement('style');
          style.textContent = `
            @keyframes pulse {
              0%, 100% {
                box-shadow: 0 0 12px rgba(6, 182, 212, 0.8), 0 0 24px rgba(6, 182, 212, 0.4);
              }
              50% {
                box-shadow: 0 0 20px rgba(6, 182, 212, 1), 0 0 40px rgba(6, 182, 212, 0.6);
              }
            }
          `;
          container.appendChild(style);
          
          el.appendChild(container);
          el.style.pointerEvents = 'auto';
          el.style.cursor = 'pointer';
          
          // Hover effect
          el.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.3)';
            tooltip.style.opacity = '1';
            tooltip.style.display = 'block';
          });
          el.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
            tooltip.style.opacity = '0';
            setTimeout(() => {
              tooltip.style.display = 'none';
            }, 200);
          });
          el.addEventListener('mousemove', (e: MouseEvent) => {
            tooltip.style.left = e.clientX + 10 + 'px';
            tooltip.style.top = e.clientY - 30 + 'px';
          });
          
          // Click to navigate
          el.addEventListener('click', () => {
            window.location.href = `/platforms/${d.slug}`;
          });
          
          return el;
        }}
        atmosphereColor="#06b6d4"
        atmosphereAltitude={0.15}
        width={typeof window !== 'undefined' ? window.innerWidth > 768 ? 800 : window.innerWidth - 32 : 800}
        height={typeof window !== 'undefined' ? window.innerWidth > 768 ? 500 : 400 : 500}
      />
    </div>
  );
}
