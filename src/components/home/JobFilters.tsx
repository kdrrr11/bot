import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { jobCategories } from '../../data/jobCategories';
import { turkishCities } from '../../data/turkishCities';

interface JobFiltersProps {
  filters: {
    searchTerm: string;
    category: string;
    subCategory: string;
    city: string;
    experienceLevel: string;
    sortBy: 'newest' | 'oldest';
  };
  onFilterChange: (filters: any) => void;
  availableCategories?: Set<string>;
}

const experienceLevels = [
  { id: 'entry', name: 'Yeni Başlayan (0-1 Yıl)' },
  { id: 'junior', name: 'Junior (1-3 Yıl)' },
  { id: 'mid', name: 'Mid-Level (3-5 Yıl)' },
  { id: 'senior', name: 'Senior (5+ Yıl)' },
  { id: 'expert', name: 'Uzman (10+ Yıl)' }
];

export function JobFilters({ filters, onFilterChange, availableCategories }: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedCategory = jobCategories.find(c => c.id === filters.category);

  return (
    <div id="filters" className="filter-section">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors touch-target"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900">Filtreler</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Filters Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Briefcase className="h-4 w-4 text-red-600" />
              Kategori
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value, subCategory: '' })}
              className="form-input w-full"
            >
              <option value="">Tüm Kategoriler</option>
              {jobCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Filter */}
          {selectedCategory && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Alt Kategori
              </label>
              <select
                value={filters.subCategory}
                onChange={(e) => onFilterChange({ subCategory: e.target.value })}
                className="form-input w-full"
              >
                <option value="">Tüm Alt Kategoriler</option>
                {selectedCategory.subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="h-4 w-4 text-red-600" />
              Şehir
            </label>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="form-input w-full"
            >
              <option value="">Tüm Şehirler</option>
              {turkishCities.slice(0, 20).map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Clock className="h-4 w-4 text-red-600" />
              Deneyim Seviyesi
            </label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => onFilterChange({ experienceLevel: e.target.value })}
              className="form-input w-full"
            >
              <option value="">Tümü</option>
              {experienceLevels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <DollarSign className="h-4 w-4 text-red-600" />
              Sıralama
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="form-input w-full"
            >
              <option value="newest">En Yeni İlanlar</option>
              <option value="oldest">En Eski İlanlar</option>
            </select>
          </div>

          {/* Popular Searches */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">🔥 Popüler Aramalar</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Mühendis', category: 'teknoloji' },
                { name: 'Garson', category: 'hizmet' },
                { name: 'Kurye', category: 'lojistik' },
                { name: 'Güvenlik', category: 'guvenlik' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => onFilterChange({ category: item.category })}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}