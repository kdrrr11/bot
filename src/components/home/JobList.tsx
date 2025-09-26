import React, { useEffect } from 'react';
import { Briefcase, Heart } from 'lucide-react';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { JobCard } from './JobCard';
import { FavoriteJobs } from './FavoriteJobs';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { JobListing } from '../../types';

interface JobListProps {
  jobs: JobListing[];
  category?: string;
  location?: string;
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  const { user } = useAuthContext();
  
  // Sayfalama hook'u
  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    getPageNumbers,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex
  } = usePagination(jobs, { itemsPerPage: 20 });

  const handleJobDeleted = () => {
    if (onJobDeleted) {
      onJobDeleted();
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-responsive-base font-semibold text-gray-900 mb-2">İlan Bulunamadı</h3>
          <p className="text-responsive-sm text-gray-600 mb-6">
            Bu kriterlere uygun ilan bulunamadı. Farklı arama kriterleri deneyebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-responsive">
      {/* İlan sayısı bilgisi */}
      <div className="flex items-center justify-between bg-white p-responsive rounded-lg shadow-sm border border-gray-100">
        <div className="text-responsive-xs text-gray-600">
          <span className="font-medium text-gray-900">
            {startIndex}-{endIndex}
          </span>
          {' arası gösteriliyor, toplam '}
          <span className="font-medium text-gray-900">{totalItems}</span>
          {' ilan'}
        </div>
      </div>

      {/* İlanlar listesi */}
      <div className="space-y-3 sm:space-y-4">
        {paginatedItems.map((job, index) => {
          return (
            <JobCard key={job.id} job={job} onDeleted={handleJobDeleted} />
          );
        })}
      </div>

      {/* Sayfalama */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        getPageNumbers={getPageNumbers}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}