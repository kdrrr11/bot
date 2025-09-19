import { useState, useEffect, useCallback } from 'react';
import {
  ref,
  query,
  orderByChild,
  onValue,
  equalTo,
  get,
  set,
  limitToFirst,
  startAfter,
} from 'firebase/database';
import { db } from '../lib/firebase';
import type { JobListing } from '../types';

interface UseJobsOptions {
  categoryFilter?: string;
  searchTerm?: string;
  limit?: number;
  enableRealTime?: boolean;
}

export function useJobs(options: UseJobsOptions = {}) {
  const { 
    categoryFilter, 
    searchTerm, 
    limit = 20, // Varsayılan sayfa başına 20 ilan
    enableRealTime = true 
  } = options;

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Cache için
  const [cachedJobs, setCachedJobs] = useState<Map<string, JobListing>>(new Map());

  // İlk veri yükleme - SAYFALAMA İLE
  const loadInitialJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const jobsRef = ref(db, 'jobs');
      
      // Aktif ilanları tarihe göre sıralayıp ilk batch'i al
      let jobsQuery = query(
        jobsRef,
        orderByChild('createdAt'),
        limitToFirst(limit)
      );

      // Kategori filtresi varsa
      if (categoryFilter && categoryFilter !== 'all') {
        jobsQuery = query(
          jobsRef,
          orderByChild('category'),
          equalTo(categoryFilter),
          limitToFirst(limit)
        );
      }

      if (enableRealTime) {
        // Real-time listener
        const unsubscribe = onValue(jobsQuery, (snapshot) => {
          processJobsSnapshot(snapshot, true);
        });

        return unsubscribe;
      } else {
        // Tek seferlik çekme
        const snapshot = await get(jobsQuery);
        processJobsSnapshot(snapshot, true);
      }

    } catch (error) {
      console.error('İlanlar yüklenirken hata:', error);
      setError('İlanlar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  }, [categoryFilter, limit, enableRealTime]);

  // Daha fazla ilan yükleme
  const loadMoreJobs = useCallback(async () => {
    if (!hasMore || loadingMore || !lastKey) return;

    setLoadingMore(true);
    
    try {
      const jobsRef = ref(db, 'jobs');
      
      let jobsQuery = query(
        jobsRef,
        orderByChild('createdAt'),
        startAfter(lastKey),
        limitToFirst(limit)
      );

      if (categoryFilter && categoryFilter !== 'all') {
        jobsQuery = query(
          jobsRef,
          orderByChild('category'),
          equalTo(categoryFilter),
          startAfter(lastKey),
          limitToFirst(limit)
        );
      }

      const snapshot = await get(jobsQuery);
      processJobsSnapshot(snapshot, false);

    } catch (error) {
      console.error('Daha fazla ilan yüklenirken hata:', error);
      setError('Daha fazla ilan yüklenirken bir hata oluştu');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, lastKey, categoryFilter, limit]);

  // Snapshot'ı işle
  const processJobsSnapshot = useCallback((snapshot: any, isInitial: boolean) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const jobsList: JobListing[] = [];
      const categorySet = new Set(categories);
      const newCachedJobs = new Map(cachedJobs);

      let newLastKey: string | null = null;

      Object.entries(data).forEach(([key, value]) => {
        const job = value as Omit<JobListing, 'id'>;
        const jobWithId = { id: key, ...job } as JobListing;

        // Aktif ilanları kontrol et
        if (jobWithId.status === 'active') {
          // Varsayılan değerler
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

          // Cache'e ekle
          newCachedJobs.set(key, jobWithId);
          jobsList.push(jobWithId);
          categorySet.add(jobWithId.category);
          newLastKey = key;
        }
      });

      // Premium ilanları önce sırala
      const sortedJobs = jobsList.sort((a, b) => {
        const aIsPremium = a.isPremium && a.premiumEndDate && a.premiumEndDate > Date.now();
        const bIsPremium = b.isPremium && b.premiumEndDate && b.premiumEndDate > Date.now();
        
        if (aIsPremium && !bIsPremium) return -1;
        if (!aIsPremium && bIsPremium) return 1;
        
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      // State güncellemeleri
      setCachedJobs(newCachedJobs);
      setCategories(categorySet);
      setLastKey(newLastKey);

      if (isInitial) {
        setJobs(sortedJobs);
      } else {
        // Daha fazla ilan ekle
        setJobs(prevJobs => [...prevJobs, ...sortedJobs]);
      }

      // Daha fazla ilan var mı kontrol et
      setHasMore(sortedJobs.length === limit);
      
      console.log(`✅ ${sortedJobs.length} ilan yüklendi (Sayfa başı: ${limit})`);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [categories, cachedJobs, limit]);

  // Arama filtresi uygula (client-side)
  const filteredJobs = useCallback(() => {
    if (!searchTerm) return jobs;

    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  // Ana effect
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      // Cache'i temizle ve baştan başla
      setJobs([]);
      setLastKey(null);
      setHasMore(true);
      
      unsubscribe = await loadInitialJobs();
    };

    initializeData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadInitialJobs]);

  // Public read ayarı
  useEffect(() => {
    const enablePublicRead = async () => {
      try {
        const publicReadRef = ref(db, 'admin_settings/public_read');
        await set(publicReadRef, true);
      } catch (error) {
        console.error('Public read ayarı yapılamadı:', error);
      }
    };
    enablePublicRead();
  }, []);

  return {
    jobs: filteredJobs(),
    allJobs: jobs, // Filtresiz tüm yüklenen ilanlar
    categories: Array.from(categories),
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreJobs,
    refetchJobs: loadInitialJobs,
    cachedJobsCount: cachedJobs.size
  };
}