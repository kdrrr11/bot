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
    <article className="job-card group cursor-pointer relative touch-manipulation" onClick={handleJobClick}>
      {/* Premium Background */}
      {isPremium && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-lg border-2 border-blue-300"></div>
      )}
      
      <div className="relative z-10">
      {/* Admin Silme Butonu */}
      {isAdmin && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="absolute top-2 right-2 z-20 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors touch-target"
          title="İlanı Sil"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Mobil Optimized Layout */}
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight flex-1 line-clamp-2">
            {job.title}
          </h2>

          <div className="flex flex-wrap gap-1 flex-shrink-0 items-start">
            {/* Premium rozet */}
            {isPremium && premiumPackage && (
              <PremiumBadge packageType={premiumPackage} />
            )}
            
            {/* BUGÜN ETİKETİ */}
            {isTodayJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full flex items-center gap-1 animate-pulse shadow-sm">
                <Zap className="h-3 w-3" />
                BUGÜN
              </span>
            )}
            {/* DÜN ETİKETİ */}
            {isYesterdayJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="h-3 w-3" />
                DÜN
              </span>
            )}
            {/* YENİ ETİKETİ */}
            {isRecentJob(job.createdAt) && (
              <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="h-3 w-3" />
                YENİ
              </span>
            )}
          </div>
        </div>
        
        {/* Company and Location */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="font-medium">{job.company}</span>
            <span className="text-gray-400">•</span>
            <span>{job.location}</span>
          </div>
          
          {/* Job Type Badge */}
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
            {job.type}
          </span>
        </div>
        
        {/* Salary and Date */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(job.createdAt)}</span>
            <span className="text-gray-400">•</span>
            <span>{getTimeAgo(job.createdAt)}</span>
          </div>
          
          {job.salary && (
            <span className="text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {job.salary}
            </span>
          )}
        </div>
        
        {/* Description Preview - Mobile Only */}
        <div className="sm:hidden">
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>
      </div>
      </div>
    </article>
  );
}
