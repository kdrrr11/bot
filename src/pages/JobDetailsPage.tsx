import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { JobDetailsModal } from '../components/job/JobDetailsModal';
import { JobDetails } from '../components/job/JobDetails';
import { generateMetaTags, generateSlug } from '../utils/seoUtils';
import type { JobListing } from '../types';

export function JobDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we navigated here from the job list
  const isModalView = location.state?.modal;

  useEffect(() => {
    // Sayfa yüklendiğinde en üste scroll
    window.scrollTo(0, 0);
    
    const fetchJob = async () => {
      try {
        if (!slug) return;
        
        // Slug'dan job'ı bul
        const jobsRef = ref(db, 'jobs');
        const snapshot = await get(jobsRef);
        
        if (snapshot.exists()) {
          const allJobs = snapshot.val();
          let foundJob: JobListing | null = null;
          
          // Slug ile eşleşen job'ı bul
          for (const [jobId, jobData] of Object.entries(allJobs)) {
            const job = jobData as any;
            if (job.status === 'active') {
              const jobSlug = generateSlug(job.title);
              if (jobSlug === slug) {
                foundJob = { id: jobId, ...job } as JobListing;
                break;
              }
            }
          }
          
          if (foundJob) {
            setJob(foundJob);
            
            // Update meta tags for SEO
            generateMetaTags({
              title: foundJob.title,
              description: foundJob.description,
              keywords: [foundJob.category, foundJob.type, foundJob.location, 'iş ilanı', 'kariyer'],
              url: window.location.pathname,
              jobData: foundJob
            });
          } else {
            setError('İlan bulunamadı');
          }
        } else {
          setError('İlan bulunamadı');
        }
      } catch (err) {
        setError('İlan yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  const handleClose = () => {
    const previousPath = sessionStorage.getItem('previousPath') || '/';
    navigate(previousPath, { 
      replace: true,
      state: { scrollToPosition: sessionStorage.getItem('scrollPosition') }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-600">
        {error || 'İlan bulunamadı'}
      </div>
    );
  }

  // Show modal if we navigated from job list, otherwise show full page
  return isModalView ? (
    <JobDetailsModal job={job} onClose={handleClose} />
  ) : (
    <JobDetails job={job} />
  );
}