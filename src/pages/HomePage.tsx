import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SearchHero } from '../components/home/SearchHero';
import { JobList } from '../components/home/JobList';
import { JobFilters } from '../components/home/JobFilters';
import { FavoriteJobs } from '../components/home/FavoriteJobs';
import { SEOJobContent } from '../components/job/SEOJobContent';
import { useJobs } from '../hooks/useJobs';
import { useJobFilters } from '../hooks/useJobFilters';
import { jobCategories } from '../data/jobCategories';
import { useAuthContext } from '../contexts/AuthContext';
import { generateMetaTags } from '../utils/seoUtils';
import { checkJobDates } from '../utils/dateUtils';
import { Heart, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export function HomePage() {
  const { user } = useAuthContext();
  const { pageNumber } = useParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const { jobs, categories, loading, error, refetchJobs } = useJobs(undefined, searchTerm, 40);
  const { filters, updateFilters, filteredJobs } = useJobFilters(jobs);

  useEffect(() => {
    // SEO meta tags
    generateMetaTags({
      title: 'İş İlanları 2025 - İstanbul Ankara İzmir Güncel İş Fırsatları',
      description: 'Türkiye\'nin en güncel iş ilanları sitesi! İstanbul, Ankara, İzmir\'de mühendis, garson, kurye, resepsiyon görevlisi, aşçı yardımcısı, özel güvenlik pozisyonları. Ücretsiz CV oluştur, hemen başvur. 2025 kariyer fırsatları burada!',
      keywords: [
        'iş ilanları', 'istanbul iş ilanları', 'ankara iş ilanları', 'izmir iş ilanları',
        'mühendis iş ilanları', 'garson iş ilanları', 'kurye iş ilanları', 
        'resepsiyon görevlisi iş ilanları', 'aşçı yardımcısı iş ilanları', 'özel güvenlik iş ilanları',
        'güncel iş ilanları', 'yeni iş ilanları', 'part time iş ilanları', 'tam zamanlı iş ilanları',
        'uzaktan çalışma iş ilanları', 'freelance iş ilanları', 'home office iş ilanları',
        'iş ara', 'iş bul', 'kariyer fırsatları', 'iş başvurusu', 'cv oluştur', 'ücretsiz cv',
        'özgeçmiş hazırlama', 'iş arama sitesi', 'eleman.net', 'kariyer.net', 'secretcv',
        'yenibiris', 'sahibinden iş ilanları', 'işkur iş ilanları', 'online iş başvurusu'
      ],
      url: window.location.pathname
    });

    // Yeni ilan oluşturulduğunda bildirim göster
    if (location.state?.newJobCreated) {
      toast.success('🎉 İlanınız başarıyla yayınlandı ve en üstte görünüyor!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500'
        },
        icon: '🚀'
      });
      
      // State'i temizle
      window.history.replaceState({}, document.title);
    }

    // Scroll pozisyonunu geri yükle
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    const previousPath = sessionStorage.getItem('previousPath');
    
    if (scrollPosition && previousPath && previousPath.includes(window.location.pathname)) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
        sessionStorage.removeItem('previousPath');
      }, 100);
    } else if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Debug: İlan tarihlerini kontrol et
    if (jobs.length > 0) {
      checkJobDates(jobs);
    }
  }, [pageNumber, location.state, jobs]);

  const getCategoryName = (categoryId: string) => {
    const category = jobCategories.find(c => c.id === categoryId);
    return category ? `${category.name} İlanları` : 'Tüm İlanlar';
  };

  return (
    <div className="space-y-8">
      <SearchHero
        onSearch={setSearchTerm}
        onLocationChange={(city) => updateFilters({ city })}
        onCategorySelect={(category) => updateFilters({ category, subCategory: '' })}
        availableCategories={categories}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <JobFilters
            filters={filters}
            onFilterChange={updateFilters}
            availableCategories={categories}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {filters.category ? getCategoryName(filters.category) : 'Tüm İlanlar'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredJobs.length} ilan bulundu
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="mt-4 text-gray-600">İlanlar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <JobList jobs={filteredJobs} onJobDeleted={refetchJobs} />
          )}
        </div>
      </div>

      {/* SEO Content */}
      <SEOJobContent />
    </div>
  );
}