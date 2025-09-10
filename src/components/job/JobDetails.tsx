import React, { useEffect } from 'react';
import { MapPin, Building2, Clock, Mail, Phone, MessageCircle, Briefcase, FileText, ArrowLeft, Calendar, DollarSign, User, ChevronLeft } from 'lucide-react';
import { formatDate, formatDateTime, getTimeAgo } from '../../utils/dateUtils';
import { RelatedJobs } from './RelatedJobs';
import { ApplyButton } from './ApplyButton';
import { Breadcrumb } from '../ui/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { generateMetaTags } from '../../utils/seoUtils';
import { useJobs } from '../../hooks/useJobs';
import type { JobListing } from '../../types';

interface JobDetailsProps {
  job: JobListing;
}

export function JobDetails({ job }: JobDetailsProps) {
  const { jobs } = useJobs(undefined, undefined, 40);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    generateMetaTags({
      title: job.title,
      description: job.description,
      keywords: [job.category, job.type, job.location, 'iş ilanı', 'kariyer'],
      url: window.location.pathname,
      jobData: job
    });
  }, [job]);

  const breadcrumbItems = [
    { label: 'İş İlanları', href: '/' },
    { label: job.category, href: `/is-ilanlari/${job.category}` },
    { label: job.title }
  ];

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned.startsWith('0') ? cleaned : `0${cleaned}`;
  };

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/90${cleaned.startsWith('0') ? cleaned.substring(1) : cleaned}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Geri dön"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-gray-900 truncate">
            {job.title}
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {job.company}
          </p>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-4xl mx-auto">
        <article className="bg-white md:rounded-2xl md:shadow-soft overflow-hidden md:mt-6" itemScope itemType="https://schema.org/JobPosting">
          
          {/* Desktop Header */}
          <div className="hidden md:block bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg text-gray-800 font-semibold">
                    {job.company}
                  </h2>
                </div>
              </div>
            </div>

            <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full inline-block">
              {job.category} • {job.subCategory}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              {job.title}
            </h1>
            <h2 className="text-lg text-gray-700 mb-3">
              {job.company}
            </h2>
            <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full inline-block">
              {job.category}
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Job Description */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                İş Tanımı
              </h3>
              <div className="prose max-w-none text-gray-700 leading-relaxed mb-6" itemProp="description">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 text-sm md:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Meta Bilgiler - İş tanımının altında düz metin */}
              <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
                <div>
                  <strong>Lokasyon:</strong> {job.location}
                </div>
                <div>
                  <strong>Çalışma Şekli:</strong> {job.type}
                </div>
                <div>
                  <strong>Yayın Tarihi:</strong> {formatDate(job.createdAt)} ({getTimeAgo(job.createdAt)})
                </div>
                {job.salary && (
                  <div>
                    <strong className="text-green-700">Maaş:</strong> <span className="text-green-700">{job.salary}</span>
                  </div>
                )}
                {job.educationLevel && (
                  <div>
                    <strong>Eğitim Seviyesi:</strong> {job.educationLevel}
                  </div>
                )}
                {job.experience && (
                  <div>
                    <strong>Deneyim:</strong> {job.experience}
                  </div>
                )}
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                İletişim
              </h3>
              
              <div className="space-y-4">
                {job.contactEmail && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">E-posta</span>
                    </div>
                    <a 
                      href={`mailto:${job.contactEmail}`}
                      className="text-blue-700 hover:text-blue-800 font-medium break-all"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                )}
                
                {job.contactPhone && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Telefon</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href={`tel:${formatPhoneNumber(job.contactPhone)}`}
                        className="text-green-700 hover:text-green-800 font-medium"
                      >
                        {formatPhoneNumber(job.contactPhone)}
                      </a>
                      <a 
                        href={getWhatsAppLink(job.contactPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {job.businessPhone && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">İş Telefonu</span>
                    </div>
                    <a 
                      href={`tel:${formatPhoneNumber(job.businessPhone)}`}
                      className="text-gray-700 hover:text-gray-800 font-medium"
                    >
                      {formatPhoneNumber(job.businessPhone)}
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Related Jobs */}
          <RelatedJobs currentJob={job} jobs={jobs} />

          {/* Fixed Apply Button */}
          <ApplyButton 
            email={job.contactEmail} 
            phone={job.contactPhone || job.businessPhone} 
          />
        </article>
      </div>
    </div>
  );
}