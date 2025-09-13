import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
import {
  isToday,
  isYesterday,
  isThisWeek,
} from '../../utils/dateUtils';
import { generateJobUrl, generateSlug } from '../../utils/seoUtils';
import { useAuthContext } from '../../contexts/AuthContext';
import { useJobActions } from '../../hooks/useJobActions';
import { PremiumBadge } from '../premium/PremiumBadge';
import { toast } from 'react-hot-toast';
import type { JobListing } from '../../types';

interface JobCardProps {
  job: JobListing;
  onDeleted?: () => void;
}

export function JobCard({ job, onDeleted }: JobCardProps) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthContext();
  const { deleteJob, isDeleting } = useJobActions();

  // Premium kontrolü
  const isPremium = job.isPremium && job.premiumEndDate && job.premiumEndDate > Date.now();
  const premiumPackage = job.premiumPackage as 'daily' | 'weekly' | 'monthly' | undefined;
  const handleJobClick = () => {
    // Scroll pozisyonunu kaydet
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    sessionStorage.setItem(
      'previousPath',
      window.location.pathname + window.location.search
    );

    navigate(generateJobUrl(job));
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // İlan kartına tıklama olayını engelle

    const confirmMessage = `"${job.title}" ilanını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`;

    if (window.confirm(confirmMessage)) {
      try {
        console.log('İlan silme onaylandı:', job.id);

        const success = await deleteJob(job.id);
        if (success) {
          toast.success('İlan başarıyla silindi');
          if (onDeleted) onDeleted();
        } else {
          toast.error('İlan silinemedi');
        }
      } catch (error) {
        console.error('İlan silme hatası:', error);
        toast.error('İlan silinirken bir hata oluştu');
      }
    }
  };

  // Tarih kontrolleri
  const isTodayJob = (createdAt: number) => {
    if (!createdAt || isNaN(createdAt) || createdAt <= 0) return false;
    return isToday(createdAt);
  };

  const isYesterdayJob = (createdAt: number) => {
    if (!createdAt || isNaN(createdAt) || createdAt <= 0) return false;
    return isYesterday(createdAt);
  };

  const isRecentJob = (createdAt: number) => {
    if (!createdAt || isNaN(createdAt) || createdAt <= 0) return false;
    return (
      isThisWeek(createdAt) &&
      !isTodayJob(createdAt) &&
      !isYesterdayJob(createdAt)
    );
  };

  return (
    <article
      className={`job-card group cursor-pointer relative ${
        isPremium ? 'border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50' : ''
      }`}
      onClick={handleJobClick}
    >
      {/* Admin Silme Butonu */}
      {isAdmin && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="absolute top-3 right-3 z-10 p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
          title="İlanı Sil"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Benzer İlanlar tasarımı - Kompakt görünüm */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight flex-1">
            {job.title}
          </h2>

          
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {/* Premium rozet */}
            {isPremium && premiumPackage && (
              <PremiumBadge packageType={premiumPackage} />
            )}
            
            {/* BUGÜN ETİKETİ */}
            {isTodayJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full flex items-center gap-1 animate-pulse">
                <Zap className="h-3 w-3" />
                BUGÜN
              </span>
            )}
            {/* DÜN ETİKETİ */}
            {isYesterdayJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                DÜN
              </span>
            )}
            {/* YENİ ETİKETİ */}
            {isRecentJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                YENİ
              </span>
            )}
          </div>
        </div>
        
        {/* Şehir ve tarih bilgisi - Küçük font */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{job.location}</span>
        </div>
      </div>
    </article>
  );
}
