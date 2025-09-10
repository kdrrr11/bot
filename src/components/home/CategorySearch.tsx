import React from 'react';
import { jobCategories } from '../../data/jobCategories';

interface CategorySearchProps {
  onCategorySelect: (categoryId: string) => void;
  availableCategories?: Set<string>;
}

export function CategorySearch({ onCategorySelect, availableCategories }: CategorySearchProps) {
  // Filter categories that have active listings
  const activeCategories = jobCategories.filter(category => 
    !availableCategories || availableCategories.has(category.id)
  );

  // Popüler arama terimleri
  const popularSearchTerms = [
    { id: 'teknoloji', name: 'Mühendis' },
    { id: 'hizmet', name: 'Garson' },
    { id: 'lojistik', name: 'Kurye' },
    { id: 'turizm', name: 'Resepsiyon' },
    { id: 'hizmet', name: 'Aşçı Yardımcısı' },
    { id: 'guvenlik', name: 'Özel Güvenlik' }
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {/* Popüler arama terimleri */}
      <div className="w-full mb-2">
        <p className="text-xs text-gray-500 mb-2">Popüler Aramalar:</p>
        <div className="flex flex-wrap gap-2">
          {popularSearchTerms.map((term, index) => (
            <button
              key={index}
              onClick={() => onCategorySelect(term.id)}
              className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {term.name}
            </button>
          ))}
        </div>
      </div>

      {activeCategories.slice(0, 8).map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="px-3 py-1.5 text-sm rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          {category.name}
        </button>
      ))}
      <button
        onClick={() => onCategorySelect('')}
        className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        Tüm Kategoriler
      </button>
    </div>
  );
}