import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { turkishCities } from '../../data/turkishCities';

interface LocationSearchProps {
  onLocationChange: (location: string) => void;
}

export function LocationSearch({ onLocationChange }: LocationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = turkishCities.filter(city =>
    city.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onLocationChange(value);
    setShowSuggestions(true);
  };

  const handleCitySelect = (city: string) => {
    setInputValue(city);
    onLocationChange(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        value={inputValue}
        placeholder="Şehir seçin (İstanbul, Ankara, İzmir...)"
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="form-input w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
      />

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-strong border border-gray-200 max-h-64 overflow-y-auto">
          {filteredCities.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-sm">Şehir bulunamadı</div>
          ) : (
            filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-3 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors text-sm sm:text-base touch-target"
              >
                {city}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}