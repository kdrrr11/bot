import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  X,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Crown,
  Star,
  Bookmark
} from 'lucide-react';
import {
  isToday,
  isYesterday,
  isThisWeek,
  formatDate,
  getTimeAgo,
} from '../../utils/dateUtils';
import { generateJobUrl } from '../../utils/seoUtils';
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
    e.stopPropagation();

    const confirmMessage = `"${job.title}" ilanını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`;

    if (window.confirm(confirmMessage)) {
      try {
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
  const isTodayJob = isToday(job.createdAt);
  const isYesterdayJob = isYesterday(job.createdAt);
  const isRecentJob = isThisWeek(job.createdAt) && !isTodayJob && !isYesterdayJob;

  return (
    <article 
      className={`job-card group cursor-pointer relative touch-manipulation ${
        isPremium ? 'job-card-premium' : ''
      }`} 
      onClick={handleJobClick}
      itemScope 
      itemType="https://schema.org/JobPosting"
    >
      {/* Premium Top Border */}
      {isPremium && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-t-xl"></div>
      )}
      
      <div className="relative z-10">
        {/* Admin Delete Button */}
        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="absolute top-3 right-3 z-20 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors touch-target shadow-sm"
            title="İlanı Sil"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Card Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 
                className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight line-clamp-2 mb-2"
                itemProp="title"
              >
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="font-semibold" itemProp="hiringOrganization">{job.company}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0 items-end">
              {/* Premium Badge */}
              {isPremium && premiumPackage && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-bold">
                  <Crown className="h-3 w-3" />
                  PREMİUM
                </div>
              )}
              
              {/* Date Badges */}
              {isTodayJob && (
                <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full flex items-center gap-1 animate-pulse shadow-md">
                  <Zap className="h-3 w-3" />
                  BUGÜN
                </span>
              )}
              {isYesterdayJob && (
                <span className="px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="h-3 w-3" />
                  DÜN
                </span>
              )}
              {isRecentJob && (
                <span className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded-full flex items-center gap-1 shadow-md">
                  <Star className="h-3 w-3" />
                  YENİ
                </span>
              )}
            </div>
          </div>
          
          {/* Location and Job Type */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span itemProp="jobLocation">{job.location}</span>
            </div>
            
            <span 
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold"
              itemProp="employmentType"
            >
              {job.type}
            </span>
          </div>
          
          {/* Description Preview */}
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed" itemProp="description">
              {job.description}
            </p>
          </div>
          
          {/* Bottom Row */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(job.createdAt)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{getTimeAgo(job.createdAt)}</span>
            </div>
            
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {job.salary}
                </span>
              </div>
            )}
          </div>
          
          {/* Mobile Description */}
          <div className="sm:hidden">
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="badge-category">
              {job.category}
            </span>
            {job.subCategory && job.subCategory !== 'custom' && (
              <span className="badge-category">
                {job.subCategory}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}