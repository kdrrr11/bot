import React, { useState } from 'react';
import { JobSearchInput } from './JobSearchInput';
import { CategorySearch } from './CategorySearch';
import { LocationSearch } from './LocationSearch';
import { Button } from '../ui/Button';
import { Filter, FileText, TrendingUp, MapPin, Briefcase, Search } from 'lucide-react';

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
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            İş İlanları 2025 - Türkiye'nin En Güncel İş Fırsatları
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-4 max-w-4xl mx-auto leading-relaxed">
            Türkiye'nin en kapsamlı iş ilanları platformu. <strong className="text-white">6 Ocak 2025</strong> itibarıyla <strong className="text-white">50.000+</strong> aktif iş ilanı. İstanbul, Ankara, İzmir ve tüm şehirlerde güncel iş fırsatları.
          </p>
          <p className="text-sm sm:text-base text-blue-200 mb-6 max-w-3xl mx-auto">
            Mühendis, garson, kurye, resepsiyon görevlisi, aşçı yardımcısı, özel güvenlik pozisyonları ve binlerce farklı kariyer fırsatı. Hemen başvurun, kariyerinizi şekillendirin!
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-200">
            <span className="bg-white/20 px-3 py-1 rounded-full">✨ Ücretsiz İlan Ver</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">📄 CV Oluştur</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">🚀 Hemen Başvur</span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">50K+</div>
            <div className="text-xs sm:text-sm text-blue-200">Güncel İlan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">81</div>
            <div className="text-xs sm:text-sm text-blue-200">İl Genelinde</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">25+</div>
            <div className="text-xs sm:text-sm text-blue-200">Farklı Sektör</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">7/24</div>
            <div className="text-xs sm:text-sm text-blue-200">Güncel Akış</div>
          </div>
        </div>
        
        {/* Popular Cities Quick Links */}
        <div className="mb-8">
          <p className="text-blue-200 text-sm mb-4 font-medium">🏙️ Popüler Şehirlerdeki İş İlanları:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'].map((city) => (
              <button
                key={city}
                onClick={() => onLocationChange(city)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        
        {/* Popular Job Types */}
        <div className="mb-8">
          <p className="text-blue-200 text-sm mb-4 font-medium">💼 En Çok Aranan Pozisyonlar:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'Mühendis', category: 'teknoloji' },
              { name: 'Garson', category: 'hizmet' },
              { name: 'Kurye', category: 'lojistik' },
              { name: 'Resepsiyon', category: 'turizm' },
              { name: 'Aşçı Yardımcısı', category: 'hizmet' },
              { name: 'Özel Güvenlik', category: 'guvenlik' }
            ].map((job) => (
              <button
                key={job.name}
                onClick={() => onCategorySelect(job.category)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                {job.name}
              </button>
            ))}
          </div>
        </div>

        {/* Çalışma Şekilleri */}
        <div className="mb-8">
          <p className="text-blue-200 text-sm mb-4 font-medium">⏰ Çalışma Şekillerine Göre İş İlanları:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'Tam Zamanlı', type: 'full-time' },
              { name: 'Part Time', type: 'part-time' },
              { name: 'Remote', type: 'remote' },
              { name: 'Freelance', type: 'freelance' },
              { name: 'Staj', type: 'internship' }
            ].map((workType) => (
              <button
                key={workType.name}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                {workType.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-strong max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <JobSearchInput 
                onSearch={onSearch} 
                onFocus={() => setShowCategories(true)}
              />
              {showCategories && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-gray-200 p-4">
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                const filtersElement = document.getElementById('filters');
                if (filtersElement) {
                  filtersElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Filter className="h-4 w-4" />
              Detaylı Filtreler
            </Button>
            <Button
              onClick={() => window.location.href = '/cv-olustur'}
              className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <FileText className="h-4 w-4" />
              Ücretsiz CV Oluştur
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
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Ücretsiz Kullanım
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                50K+ İlan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}