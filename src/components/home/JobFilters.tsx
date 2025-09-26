import React, { useState } from 'react';
import { Filter, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { jobCategories } from '../../data/jobCategories';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
  filters: {
    category: string;
    subCategory: string;
    experienceLevel: string;
    sortBy: 'newest' | 'oldest';
  };
}

const experienceLevels = [
  { id: 'entry', name: 'Yeni Başlayan' },
  { id: 'junior', name: 'Junior (1-3 Yıl)' },
  { id: 'mid', name: 'Mid-Level (3-5 Yıl)' },
  { id: 'senior', name: 'Senior (5+ Yıl)' }
];

export function JobFilters({ onFilterChange, filters }: JobFiltersProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedCategory = jobCategories.find(c => c.id === filters.category);

  return (
    <div id="filters" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors touch-target"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="h-5 w-5" />
          <h3 className="text-responsive-sm font-medium">Filtreler</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-responsive border-t border-gray-100">
          {/* CV Oluştur */}
          {/* Desktop'ta CV oluştur bölümü */}
          <div className="hidden md:block">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-responsive-sm font-medium text-blue-900">CV Oluştur</h3>
              </div>
              <p className="text-responsive-xs text-blue-700 mb-4">
                Profesyonel CV'nizi oluşturun ve iş başvurularınızda kullanın
              </p>
              <Button
                onClick={() => navigate('/cv-olustur')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              >
                CV Oluşturmaya Başla
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-responsive-xs font-medium text-gray-700 mb-2">
                Popüler Kategoriler
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ category: e.target.value, subCategory: '' })}
                className="form-input w-full"
              >
                <option value="">Tüm Kategoriler</option>
                <option value="teknoloji">Mühendis İş İlanları</option>
                <option value="hizmet">Garson İş İlanları</option>
                <option value="lojistik">Kurye İş İlanları</option>
                <option value="turizm">Resepsiyon Görevlisi İlanları</option>
                <option value="hizmet">Aşçı Yardımcısı İlanları</option>
                <option value="guvenlik">Özel Güvenlik İlanları</option>
                {jobCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-responsive-xs font-medium text-gray-700 mb-2">
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

            <div>
              <label className="block text-responsive-xs font-medium text-gray-700 mb-2">
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

            <div>
              <label className="block text-responsive-xs font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                className="form-input w-full"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}