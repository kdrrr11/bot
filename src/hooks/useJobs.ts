import { useState, useEffect } from 'react';
import {
  ref,
  query,
  orderByChild,
  onValue,
  equalTo,
  get,
  set,
} from 'firebase/database';
import { db } from '../lib/firebase';
import type { JobListing } from '../types';

export function useJobs(categoryFilter?: string, searchTerm?: string, limit?: number) {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Yeniden veri çekme fonksiyonu
  const refetchJobs = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    console.log('🚀 İlanlar hemen yükleniyor...');

    // Public read ayarını kontrol et
    const enablePublicRead = async () => {
      try {
        const publicReadRef = ref(db, 'admin_settings/public_read');
        await set(publicReadRef, true);
      } catch (error) {
        console.error('Public read ayarı yapılamadı:', error);
      }
    };

    enablePublicRead();

    const jobsRef = ref(db, 'jobs');
    
    // TÜM İLANLARI HEMEN YÜKLEYİN - KULLANICI DENEYİMİ İÇİN
    const loadAllJobs = async () => {
      try {
        const snapshot = await get(jobsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const jobsList: JobListing[] = [];
          const categorySet = new Set<string>();
          
          Object.entries(data).forEach(([key, value]) => {
            const job = value as Omit<JobListing, 'id'>;
            const jobWithId = { id: key, ...job } as JobListing;
            
            if (jobWithId.status === 'active') {
              // Eksik alanları kontrol et
              if (!jobWithId.title) jobWithId.title = 'İlan Başlığı';
              if (!jobWithId.description) jobWithId.description = 'Açıklama bulunmuyor';
              if (!jobWithId.company) jobWithId.company = 'Şirket Adı';
              if (!jobWithId.location) jobWithId.location = 'Lokasyon';
              
              if (!jobWithId.createdAt || isNaN(jobWithId.createdAt) || jobWithId.createdAt <= 0) {
                jobWithId.createdAt = Date.now();
              }
              
              if (!jobWithId.updatedAt || isNaN(jobWithId.updatedAt) || jobWithId.updatedAt <= 0) {
                jobWithId.updatedAt = jobWithId.createdAt;
              }
              
              jobsList.push(jobWithId);
              categorySet.add(jobWithId.category);
            }
          });
          
          // Sıralama: Premium ilanlar önce, sonra tarihe göre
          const sortedJobs = jobsList.sort((a, b) => {
            // Premium ilanlar önce
            const aIsPremium = a.isPremium && a.premiumEndDate && a.premiumEndDate > Date.now();
            const bIsPremium = b.isPremium && b.premiumEndDate && b.premiumEndDate > Date.now();
            
            if (aIsPremium && !bIsPremium) return -1;
            if (!aIsPremium && bIsPremium) return 1;
            
            // Sonra tarihe göre
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          
          // TÜM İLANLARI HEMEN YÜKLEYİN
          setJobs(sortedJobs);
          setCategories(categorySet);
          setLoading(false);
          
          console.log(`✅ Tüm ${sortedJobs.length} ilan hemen yüklendi - KULLANICI DENEYİMİ İYİLEŞTİRİLDİ`);
        }
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        setError('İlanlar yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    loadAllJobs();

    return () => {
      // Cleanup if needed
    };
  }, [categoryFilter, searchTerm, refreshTrigger]);

  return { jobs, categories, loading, error, refetchJobs };
}
