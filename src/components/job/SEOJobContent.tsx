import React from 'react';
import { Briefcase, Search, FileText, TrendingUp, Users, MapPin, Clock, Star, CheckCircle, ArrowRight, Target, Award, Building2, Globe, Zap, Heart, Shield, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SEOJobContentProps {
  jobData?: {
    category?: string;
    location?: string;
    type?: string;
    title?: string;
  };
}

export function SEOJobContent({ jobData }: SEOJobContentProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 mt-8 sm:mt-12 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
      <div className="max-w-6xl mx-auto space-responsive">
        
        {/* Ana Başlık */}
        <div className="text-center">
          <h1 className="text-responsive-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            {currentYear} İş İlanları ve Kariyer Fırsatları Rehberi
          </h1>
          <p className="text-responsive-sm text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Türkiye'nin en kapsamlı iş ilanları platformunda binlerce güncel iş fırsatı sizi bekliyor. 
            İş arama sürecinizden CV hazırlamaya, mülakat tekniklerinden kariyer planlamasına kadar 
            ihtiyacınız olan her şey burada.
          </p>
        </div>

        {/* İş Arama Rehberi */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive">
          <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-6 w-6 text-blue-600" />
              <h3 className="text-responsive-base font-semibold text-gray-900">İş Nasıl Aranır?</h3>
            </div>
            <p className="text-responsive-sm text-gray-700 mb-4">
              Etkili iş arama stratejileri ile hayalinizdeki işi bulun. Doğru anahtar kelimeler, 
              filtreleme teknikleri ve başvuru süreçleri hakkında bilgi edinin.
            </p>
            <ul className="space-y-2 text-responsive-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Anahtar kelime optimizasyonu
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Gelişmiş filtreleme seçenekleri
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Şirket araştırması teknikleri
              </li>
            </ul>
          </div>

          <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h3 className="text-responsive-base font-semibold text-gray-900">CV Nasıl Hazırlanır?</h3>
            </div>
            <p className="text-responsive-sm text-gray-700 mb-4">
              Profesyonel CV hazırlama teknikleri ile öne çıkın. Modern CV formatları, 
              ATS uyumlu şablonlar ve dikkat çeken özgeçmiş örnekleri.
            </p>
            <ul className="space-y-2 text-responsive-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                ATS uyumlu CV formatları
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Sektöre özel CV örnekleri
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ücretsiz CV oluşturma araçları
              </li>
            </ul>
            <Link 
              to="/cv-olustur" 
              className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-medium text-responsive-xs"
            >
              CV Oluştur <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <h3 className="text-responsive-base font-semibold text-gray-900">Kariyer Gelişimi</h3>
            </div>
            <p className="text-responsive-sm text-gray-700 mb-4">
              Kariyerinizi bir sonraki seviyeye taşıyacak stratejiler. Beceri geliştirme, 
              networking ve profesyonel gelişim fırsatları.
            </p>
            <ul className="space-y-2 text-responsive-xs text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Beceri geliştirme programları
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Networking stratejileri
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Mülakat hazırlık teknikleri
              </li>
            </ul>
          </div>
        </section>

        {/* Sektör Bazlı İş Fırsatları */}
        <section>
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            Sektör Bazlı İş İlanları ve Kariyer Fırsatları
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
            {[
              { 
                sector: 'Teknoloji İş İlanları', 
                jobs: ['Yazılım Geliştirici', 'Veri Analisti', 'Siber Güvenlik', 'DevOps Mühendisi'],
                icon: <Zap className="h-5 w-5" />,
                color: 'blue'
              },
              { 
                sector: 'Sağlık İş İlanları', 
                jobs: ['Doktor', 'Hemşire', 'Fizyoterapist', 'Eczacı'],
                icon: <Heart className="h-5 w-5" />,
                color: 'red'
              },
              { 
                sector: 'Eğitim İş İlanları', 
                jobs: ['Öğretmen', 'Akademisyen', 'Eğitim Koordinatörü', 'Rehber Öğretmen'],
                icon: <Lightbulb className="h-5 w-5" />,
                color: 'yellow'
              },
              { 
                sector: 'Finans İş İlanları', 
                jobs: ['Muhasebeci', 'Mali Müşavir', 'Finansal Analist', 'Banka Personeli'],
                icon: <TrendingUp className="h-5 w-5" />,
                color: 'green'
              },
              { 
                sector: 'İnşaat İş İlanları', 
                jobs: ['İnşaat Mühendisi', 'Mimar', 'Şantiye Şefi', 'İnşaat İşçisi'],
                icon: <Building2 className="h-5 w-5" />,
                color: 'orange'
              },
              { 
                sector: 'Satış İş İlanları', 
                jobs: ['Satış Temsilcisi', 'Pazarlama Uzmanı', 'Mağaza Müdürü', 'E-ticaret Uzmanı'],
                icon: <Target className="h-5 w-5" />,
                color: 'purple'
              },
              { 
                sector: 'Lojistik İş İlanları', 
                jobs: ['Şoför', 'Depo Görevlisi', 'Kargo Personeli', 'Lojistik Uzmanı'],
                icon: <Globe className="h-5 w-5" />,
                color: 'indigo'
              },
              { 
                sector: 'Güvenlik İş İlanları', 
                jobs: ['Güvenlik Görevlisi', 'Bekçi', 'Güvenlik Amiri', 'Kamera Operatörü'],
                icon: <Shield className="h-5 w-5" />,
                color: 'gray'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`flex items-center gap-2 mb-3 text-${item.color}-600`}>
                  {item.icon}
                  <h4 className="text-responsive-sm font-semibold text-gray-900">{item.sector}</h4>
                </div>
                <ul className="space-y-1">
                  {item.jobs.map((job, jobIndex) => (
                    <li key={jobIndex} className="text-responsive-xs text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                      • {job} İş İlanları
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Şehir Bazlı İş İlanları */}
        <section>
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            Şehir Bazlı İş İlanları ve Bölgesel Fırsatlar
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              'İstanbul İş İlanları', 'Ankara İş İlanları', 'İzmir İş İlanları', 'Bursa İş İlanları', 
              'Antalya İş İlanları', 'Adana İş İlanları', 'Konya İş İlanları', 'Gaziantep İş İlanları',
              'Mersin İş İlanları', 'Kayseri İş İlanları', 'Eskişehir İş İlanları', 'Diyarbakır İş İlanları',
              'Samsun İş İlanları', 'Denizli İş İlanları', 'Şanlıurfa İş İlanları', 'Adapazarı İş İlanları',
              'Malatya İş İlanları', 'Kahramanmaraş İş İlanları', 'Erzurum İş İlanları', 'Van İş İlanları'
            ].map((city, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer touch-target">
                <div className="text-responsive-xs font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {city}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Güncel fırsatlar
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Çalışma Şekilleri */}
        <section>
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            Çalışma Şekillerine Göre İş İlanları
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
            {[
              {
                type: 'Tam Zamanlı İş İlanları',
                description: 'Haftalık 40 saat çalışma ile tam zamanlı pozisyonlar',
                features: ['Sosyal güvence', 'Ücretli izin', 'Performans primi', 'Kariyer gelişimi']
              },
              {
                type: 'Part Time İş İlanları',
                description: 'Esnek çalışma saatleri ile yarı zamanlı fırsatlar',
                features: ['Esnek saatler', 'Ek gelir', 'Deneyim kazanma', 'Öğrenci dostu']
              },
              {
                type: 'Remote İş İlanları',
                description: 'Evden çalışma imkanı sunan uzaktan çalışma pozisyonları',
                features: ['Evden çalışma', 'Zaman tasarrufu', 'Coğrafi özgürlük', 'İş-yaşam dengesi']
              },
              {
                type: 'Freelance İş İlanları',
                description: 'Proje bazlı çalışma ile serbest meslek fırsatları',
                features: ['Proje bazlı', 'Özgür çalışma', 'Çoklu proje', 'Yüksek kazanç']
              }
            ].map((workType, index) => (
              <div key={index} className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-responsive-sm font-semibold text-gray-900 mb-2">{workType.type}</h4>
                <p className="text-responsive-xs text-gray-600 mb-4">{workType.description}</p>
                <ul className="space-y-1">
                  {workType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-xs text-gray-500 flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* İş Arama İpuçları */}
        <section>
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Award className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            Başarılı İş Arama İpuçları ve Kariyer Tavsiyeleri
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive">
            <div className="space-responsive">
              <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">İş İlanı Başvuru Süreci</h4>
                <ol className="space-y-3 text-responsive-xs text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                    <span>İlan detaylarını dikkatlice okuyun ve gereksinimlerle uyumunuzu değerlendirin</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                    <span>CV'nizi pozisyona özel olarak güncelleyin ve anahtar kelimeleri dahil edin</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                    <span>Ön yazı hazırlayın ve motivasyonunuzu net bir şekilde ifade edin</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                    <span>Başvurunuzu zamanında gönderin ve takip edin</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">Mülakat Hazırlığı</h4>
                <ul className="space-y-2 text-responsive-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Şirket hakkında detaylı araştırma yapın
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Yaygın mülakat sorularına hazırlanın
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Kıyafet seçiminizi şirket kültürüne uygun yapın
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Sorularınızı önceden hazırlayın
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-responsive">
              <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">Kariyer Planlama</h4>
                <p className="text-responsive-xs text-gray-700 mb-4">
                  Uzun vadeli kariyer hedeflerinizi belirleyin ve bu doğrultuda adımlar atın. 
                  Sürekli öğrenme ve gelişim odaklı bir yaklaşım benimseyin.
                </p>
                <ul className="space-y-2 text-responsive-xs text-gray-600">
                  <li>• Kısa ve uzun vadeli hedefler belirleyin</li>
                  <li>• Becerilerinizi sürekli geliştirin</li>
                  <li>• Sektör trendlerini takip edin</li>
                  <li>• Profesyonel network oluşturun</li>
                  <li>• Mentorluk fırsatlarını değerlendirin</li>
                </ul>
              </div>

              <div className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">Dijital Varlık Yönetimi</h4>
                <p className="text-responsive-xs text-gray-700 mb-4">
                  Günümüzde işverenler adayları online platformlarda araştırıyor. 
                  Dijital varlığınızı profesyonel bir şekilde yönetin.
                </p>
                <ul className="space-y-2 text-responsive-xs text-gray-600">
                  <li>• LinkedIn profilinizi güncel tutun</li>
                  <li>• Sosyal medya hesaplarınızı gözden geçirin</li>
                  <li>• Profesyonel e-posta adresi kullanın</li>
                  <li>• Online portfolyo oluşturun</li>
                  <li>• Sektörel içerikleri takip edin ve paylaşın</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* İstatistikler ve Trendler */}
        <section className="bg-white p-responsive rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-responsive-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            {currentYear} İş Piyasası Trendleri ve İstatistikleri
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-responsive">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-responsive-xs text-gray-600">Günlük Yeni İlan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">81</div>
              <div className="text-responsive-xs text-gray-600">İl Genelinde Fırsat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-responsive-xs text-gray-600">Farklı Sektör</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">7/24</div>
              <div className="text-responsive-xs text-gray-600">Güncel İlan Akışı</div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-responsive">
            <div>
              <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">En Çok Aranan Pozisyonlar</h4>
              <ul className="space-y-1 text-responsive-xs text-gray-600">
                <li>1. Yazılım Geliştirici</li>
                <li>2. Satış Temsilcisi</li>
                <li>3. Muhasebeci</li>
                <li>4. Öğretmen</li>
                <li>5. Hemşire</li>
              </ul>
            </div>
            <div>
              <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">Yükselen Sektörler</h4>
              <ul className="space-y-1 text-responsive-xs text-gray-600">
                <li>• E-ticaret ve Dijital Pazarlama</li>
                <li>• Sağlık Teknolojileri</li>
                <li>• Yenilenebilir Enerji</li>
                <li>• Fintech ve Blockchain</li>
                <li>• Uzaktan Çalışma Çözümleri</li>
              </ul>
            </div>
            <div>
              <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">Gelecek Becerileri</h4>
              <ul className="space-y-1 text-responsive-xs text-gray-600">
                <li>• Yapay Zeka ve Makine Öğrenmesi</li>
                <li>• Veri Analizi ve Görselleştirme</li>
                <li>• Dijital Pazarlama</li>
                <li>• Proje Yönetimi</li>
                <li>• Çok Dilli İletişim</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Son Çağrı */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-responsive rounded-xl">
          <h3 className="text-responsive-lg font-bold mb-4">Hayalinizdeki İşe Bugün Başlayın!</h3>
          <p className="text-responsive-sm mb-6 opacity-90">
            Binlerce güncel iş ilanı arasından size en uygun pozisyonu bulun. 
            Ücretsiz CV oluşturma araçlarımızla profesyonel özgeçmişinizi hazırlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 touch-target"
            >
              <Search className="h-5 w-5" />
              İş İlanlarını İncele
            </Link>
            <Link 
              to="/cv-olustur" 
              className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2 touch-target"
            >
              <FileText className="h-5 w-5" />
              Ücretsiz CV Oluştur
            </Link>
          </div>
        </section>

        {/* Anahtar Kelime Yoğun Alt Metin */}
        <section className="text-center text-responsive-xs text-gray-600 leading-relaxed">
          <p className="mb-4">
            <strong>İş İlanları {currentYear}</strong> - Türkiye'nin en güncel iş ilanları platformu olan İsilanlarim.org'da 
            <strong> iş ara</strong>, <strong>iş bul</strong>, <strong>kariyer fırsatları</strong> keşfet ve <strong>ücretsiz iş ilanı ver istanbul</strong> seçeneğiyle hemen ilan yayınla. 
            <strong>İş ilanı ver</strong>, <strong>eleman ara</strong>, <strong>personel bul</strong> seçenekleriyle 
            işverenler ve iş arayanları buluşturuyoruz. <strong>Güncel iş ilanları</strong>, 
            <strong>yeni iş fırsatları</strong>, <strong>part time iş</strong>, <strong>tam zamanlı iş</strong>, 
            <strong>uzaktan çalışma</strong>, <strong>freelance iş</strong> seçenekleriyle her ihtiyaca uygun pozisyonlar.
          </p>
          <p className="mb-4">
            <strong>İstanbul iş ilanları</strong>, <strong>Ankara iş ilanları</strong>, <strong>İzmir iş ilanları</strong> 
            başta olmak üzere 81 ilde <strong>iş imkanları</strong>. <strong>Teknoloji iş ilanları</strong>, 
            <strong>sağlık iş ilanları</strong>, <strong>eğitim iş ilanları</strong>, <strong>mühendis</strong> ve <strong>makine mühendisi</strong> pozisyonları, 
            <strong>garson</strong>, <strong>aşçı yardımcısı</strong>, <strong>resepsiyon görevlisi</strong>, <strong>özel güvenlik</strong> ve daha birçok sektörde 
            <strong>kariyer fırsatları</strong>. <strong>İş başvurusu</strong> yapmak, <strong>CV hazırlamak</strong>, 
            <strong>mülakat hazırlığı</strong> yapmak için gerekli tüm araçlar platformumuzda.
          </p>
          <p>
            <strong>İş arama motoru</strong> özelliğimizle filtreleme yapın, <strong>iş ilanı ara</strong>, 
            <strong>pozisyon ara</strong>, <strong>şirket ara</strong> seçenekleriyle aradığınızı kolayca bulun.
            <strong>Evde paketleme</strong>, <strong>kurye iş ilanları</strong>, <strong>bahçelievler kurye iş ilanları</strong>, 
            <strong>getir kurye</strong>, <strong>müşteri hizmetleri temsilcisi</strong> gibi popüler aramalara uygun ilanlar bulabilirsiniz.
            <strong>İş piyasası</strong> trendlerini takip edin, <strong>maaş bilgileri</strong> edinin, 
            <strong>kariyer rehberi</strong> ile gelişiminizi sürdürün. <strong>İş ilanı sitesi</strong> olarak 
            amacımız en kaliteli <strong>iş fırsatlarını</strong> sizlerle buluşturmak ve 
            <strong>kariyer yolculuğunuzda</strong> yanınızda olmaktır.
          </p>
          <p>
            <strong>Döner ustası iş ilanları</strong>, <strong>çağrı merkezi çalışanı</strong>, <strong>market personeli</strong>, 
            <strong>peyzaj mimarı</strong>, <strong>mekatronik mühendisi</strong> ve <strong>antalya uzaktan iş ilanları</strong> gibi 
            spesifik aramalara yönelik içeriklerimizle her sektörden iş arayanlar için çözümler sunuyoruz. 
            <strong>Dolgun maaşlı iş ilanları istanbul</strong> ve <strong>düz işçi iş ilanları</strong> kategorilerimizle 
            her seviyeden iş arayana hitap ediyoruz.
          </p>
        </section>
      </div>
    </div>
  );
}