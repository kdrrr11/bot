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
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight" id="is-ilanlari-baslik">
            İş İlanları 2025
          </h1>
          <p className="text-sm sm:text-base text-blue-100 mb-3 max-w-2xl mx-auto">
            Güncel iş fırsatları ve ücretsiz ilan verme
          </p>
        </div>
        
        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-strong max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="relative">
              <JobSearchInput 
                onSearch={onSearch} 
                onFocus={() => setShowCategories(true)}
              />
              {showCategories && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-gray-200 p-3">
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

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Button
              onClick={() => {
                const filtersElement = document.getElementById('filters');
                if (filtersElement) {
                  filtersElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none text-sm"
            >
              <Filter className="h-4 w-4" />
              Detaylı Filtreler
            </Button>
            <Button
              onClick={() => window.location.href = '/cv-olustur'}
              className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none text-sm"
            >
              <FileText className="h-4 w-4" />
              Ücretsiz CV Oluştur
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}