import React, { useState } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';
import { JobSearchInput } from './JobSearchInput';
import { CategorySearch } from './CategorySearch';
import { LocationSearch } from './LocationSearch';
import { Button } from '../ui/Button';

interface SearchHeroProps {
  onSearch: (search: string) => void;
  onLocationChange: (location: string) => void;
  onCategorySelect: (categoryId: string) => void;
  availableCategories?: Set<string>;
}

export function SearchHero({ 
  onSearch, 
  onLocationChange, 
  onCategorySelect,
  availableCategories 
}: SearchHeroProps) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <section className="search-hero -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            İş İlanları 2025
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 mb-6">
            Türkiye'nin En Güncel İş Fırsatları
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-6 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-white">6 Ocak 2025</strong> itibarıyla <strong className="text-white">50.000+</strong> aktif iş ilanı. 
            İstanbul, Ankara, İzmir ve tüm şehirlerde güncel iş fırsatları.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
              <div className="text-xs sm:text-sm text-white/70">Güncel İlan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">81</div>
              <div className="text-xs sm:text-sm text-white/70">İl Genelinde</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">25+</div>
              <div className="text-xs sm:text-sm text-white/70">Farklı Sektör</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">7/24</div>
              <div className="text-xs sm:text-sm text-white/70">Güncel Akış</div>
            </div>
          </div>
        </div>
        
        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <JobSearchInput 
                onSearch={onSearch} 
                onFocus={() => setShowCategories(true)}
              />
              {showCategories && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                  <CategorySearch 
                    onCategorySelect={(category) => {
                      onCategorySelect(category);
                      setShowCategories(false);
                    }}
                    availableCategories={availableCategories}
                  />
                </div>
              )}
            </div>
            <LocationSearch onLocationChange={onLocationChange} />
          </div>

          {/* Popular Cities */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-3 font-medium">🏙️ Popüler Şehirler:</p>
            <div className="flex flex-wrap gap-2">
              {['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'].map((city) => (
                <button
                  key={city}
                  onClick={() => onLocationChange(city)}
                  className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Job Types */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-3 font-medium">💼 Popüler Pozisyonlar:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Mühendis', category: 'teknoloji' },
                { name: 'Garson', category: 'hizmet' },
                { name: 'Kurye', category: 'lojistik' },
                { name: 'Resepsiyon', category: 'turizm' },
                { name: 'Aşçı Yardımcısı', category: 'hizmet' },
                { name: 'Güvenlik', category: 'guvenlik' }
              ].map((job) => (
                <button
                  key={job.name}
                  onClick={() => onCategorySelect(job.category)}
                  className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {job.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.location.href = '/cv-olustur'}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Ücretsiz CV Oluştur
            </Button>
            <Button
              onClick={() => {
                const filtersElement = document.getElementById('filters');
                if (filtersElement) {
                  filtersElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Detaylı Arama
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-2 font-medium">🔒 Güvenilir ve Ücretsiz Platform</p>
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                SSL Güvenli
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                KVKK Uyumlu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Ücretsiz
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                50K+ İlan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}