import React from 'react';
import { Link } from 'react-router-dom';
import { LegalInfo } from './LegalInfo';
import { Mail, MapPin, Phone, ExternalLink, Briefcase, FileText, Shield, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-responsive-base font-bold text-gray-900">İş İlanları</h2>
                <p className="text-responsive-xs text-gray-600">2025 Güncel Fırsatlar</p>
              </div>
            </div>
            <p className="text-responsive-xs text-gray-600 mb-4 leading-relaxed">
              İş İlanları platformu, işverenler ve iş arayanları bir araya getiren güvenilir bir istihdam çözümüdür. 
              Mühendis, garson, kurye, resepsiyon görevlisi, aşçı yardımcısı, özel güvenlik ve daha birçok pozisyonda binlerce güncel iş fırsatı sunuyoruz.
            </p>
            <p className="text-responsive-xs text-gray-600 leading-relaxed">
              İşverenler için ücretsiz iş ilanı verme, iş arayanlar için detaylı arama ve filtreleme özellikleriyle 
              İstanbul, Ankara, İzmir ve tüm Türkiye'de kariyer yolculuğunuzda yanınızdayız.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-responsive-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Hızlı Linkler
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-responsive-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 touch-target">
                  <Briefcase className="h-4 w-4" />
                  İş İlanları
                </Link>
              </li>
              <li>
                <Link to="/cv-olustur" className="text-responsive-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 touch-target">
                  <FileText className="h-4 w-4" />
                  CV Oluştur
                </Link>
              </li>
              <li>
                <Link to="/ilan-ver" className="text-responsive-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 touch-target">
                  <ExternalLink className="h-4 w-4" />
                  İlan Ver
                </Link>
              </li>
              <li>
                <Link to="/gizlilik-politikasi" className="text-responsive-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 touch-target">
                  <Shield className="h-4 w-4" />
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-responsive-base font-semibold text-gray-900 mb-4">Öne Çıkan Özellikler</h3>
            <ul className="space-y-2 text-responsive-xs text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Güncel ve güvenilir iş ilanları</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Detaylı kategori ve şehir bazlı arama</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Ücretsiz ilan yayınlama</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Kolay başvuru süreci</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>81 ilde iş fırsatları</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>20+ sektörde kariyer imkanları</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-responsive-xs text-gray-600">
              <a href="mailto:bilwininc@gmail.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors touch-target">
                <Mail className="h-4 w-4" />
                bilwininc@gmail.com
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Türkiye
              </span>
              <span className="hidden sm:block text-gray-300">|</span>
              <a href="tel:+905459772134" className="flex items-center gap-2 hover:text-blue-600 transition-colors touch-target">
                <Phone className="h-4 w-4" />
                +90 545 977 21 34
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-responsive-xs text-gray-600 mb-2">
                © 2025 Bilwin Inc / Kadir A. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-4 text-xs text-gray-500">
                <Link to="/gizlilik-politikasi" className="hover:text-blue-600 transition-colors touch-target">
                  Gizlilik Politikası
                </Link>
                <span>•</span>
                <Link to="/gizlilik-politikasi#veri-sahibi-haklari" className="hover:text-blue-600 transition-colors touch-target">
                  KVKK Aydınlatma Metni
                </Link>
              </div>
            </div>
          </div>

          {/* Support Note */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-responsive-xs text-gray-500">
              Destek ve hesap silme talepleri için: 
              <a href="mailto:bilwininc@gmail.com" className="text-blue-600 hover:text-blue-700 ml-1 touch-target">
                bilwininc@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}