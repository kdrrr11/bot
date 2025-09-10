import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { jobCategories } from '../../data/jobCategories';

interface JobSearchInputProps {
  onSearch: (search: string) => void;
  onFocus?: () => void;
}

export function JobSearchInput({ onSearch, onFocus }: JobSearchInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Flatten all job titles from categories
  const allJobTitles = jobCategories.flatMap(category => 
    category.subCategories.map(sub => sub.name)
  );

  // Popular search terms
  const popularSearchTerms = [
    'Yazılım Geliştirici',
    'Satış Temsilcisi',
    'Muhasebeci',
    'Öğretmen',
    'Mühendis',
    'Garson',
    'Kurye',
    'Evde Paketleme',
    'Getir Kurye',
    'Resepsiyon Görevlisi',
    'Aşçı Yardımcısı',
    'Özel Güvenlik'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);

    if (value.length >= 2) {
      const filtered = allJobTitles.filter(title =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (onFocus) onFocus();
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    } else if (inputValue.length === 0) {
      // Show popular searches when input is empty
      setSuggestions(popularSearchTerms);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder="İş ara... (örn: Yazılım Geliştirici, Satış Temsilcisi)"
        onChange={handleInputChange}
        onFocus={handleFocus}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
      />
      
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        >
          {inputValue.length === 0 && (
            <div className="px-4 py-2 text-xs text-gray-500 font-medium">Popüler Aramalar</div>
          )}
          
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                {suggestion}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı</div>
          )}
        </div>
      )}
    </div>
  );
}