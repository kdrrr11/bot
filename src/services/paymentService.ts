// PaymentService.ts - Düzeltilmiş versiyonu

import CryptoJS from 'crypto-js';

const MERCHANT_ID = import.meta.env.VITE_PYTR_MERCHANT_ID;
const MERCHANT_KEY = import.meta.env.VITE_PYTR_MERCHANT_KEY;
const MERCHANT_SALT = import.meta.env.VITE_PYTR_MERCHANT_SALT;
const API_URL = 'https://www.paytr.com/odeme/api/get-token';
const SUCCESS_URL = import.meta.env.VITE_PYTR_SUCCESS_URL;
const FAIL_URL = import.meta.env.VITE_PYTR_FAIL_URL;

export class PaymentService {
  private generatePaytrToken(data: any): string {
    console.log('🔐 PayTR token oluşturuluyor...');
    
    // ❌ ESKİ HATALI YÖNTEMİNİZ:
    // const hashStr = `${data.merchant_id}${data.user_ip}${data.merchant_oid}${data.email}${data.payment_amount}${data.user_basket}${data.no_installment}${data.max_installment}${data.user_name}${data.user_address}${data.user_phone}${data.merchant_ok_url}${data.merchant_fail_url}${data.timeout_limit}${data.currency}${data.test_mode}${MERCHANT_SALT}`;

    // ✅ DOĞRU PayTR HASH YAPISI:
    const hashStr = `${MERCHANT_ID}${data.user_ip}${data.merchant_oid}${data.email}${data.payment_amount}${data.user_basket}${data.no_installment}${data.max_installment}${data.user_name}${data.user_address}${data.user_phone}${data.merchant_ok_url}${data.merchant_fail_url}${data.timeout_limit}${data.currency}${data.test_mode}${MERCHANT_SALT}`;
    
    console.log('🔗 Hash string preview:', hashStr.substring(0, 100) + '...');
    
    // ❌ ESKİ HATALI TOKEN OLUŞTURMA:
    // const token = CryptoJS.MD5(hashStr).toString();
    // const finalToken = CryptoJS.SHA256(`${token}${MERCHANT_KEY}`).toString();
    
    // ✅ DOĞRU PayTR TOKEN YAPISI:
    const token = CryptoJS.HmacSHA256(hashStr, MERCHANT_KEY).toString(CryptoJS.enc.Base64);
    
    console.log('✅ PayTR token oluşturuldu');
    return token;
  }

  async createPayment(
    jobId: string,
    packageId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    userAddress: string
  ): Promise<{ success: boolean; token?: string; iframeToken?: string; paymentUrl?: string; error?: string }> {
    try {
      console.log('🚀 PayTR ödeme başlatılıyor...');

      // Parametreleri doğrula
      if (!MERCHANT_ID || !MERCHANT_KEY || !MERCHANT_SALT) {
        console.error('❌ PayTR ENV variables eksik:', {
          MERCHANT_ID: !!MERCHANT_ID,
          MERCHANT_KEY: !!MERCHANT_KEY, 
          MERCHANT_SALT: !!MERCHANT_SALT
        });
        return { success: false, error: 'PayTR yapılandırması eksik' };
      }

      if (!userEmail || !userEmail.includes('@')) {
        return { success: false, error: 'Geçerli bir e-posta adresi gerekli' };
      }
      
      if (!userName || userName.trim().length < 2) {
        return { success: false, error: 'Geçerli bir ad soyad gerekli' };
      }
      
      if (!userPhone || userPhone.replace(/[^0-9]/g, '').length < 10) {
        return { success: false, error: 'Geçerli bir telefon numarası gerekli' };
      }
      
      const selectedPackage = paymentPackages.find(p => p.id === packageId);
      if (!selectedPackage) {
        return { success: false, error: 'Geçersiz paket seçimi' };
      }

      // PayTR için merchant_oid oluştur
      const timestamp = Date.now();
      const merchantOid = `JOB${timestamp}`;
      
      console.log('🔑 Generated merchant_oid:', merchantOid);
      
      const paymentAmount = Math.round(selectedPackage.price * 100); // Kuruş cinsinden
      console.log('💰 Payment amount (kuruş):', paymentAmount);

      // Parametreleri temizle
      const cleanUserName = userName.trim().substring(0, 60); // PayTR limiti
      const cleanUserAddress = userAddress.trim().substring(0, 200); // PayTR limiti  
      const cleanUserPhone = userPhone.replace(/[^0-9]/g, '').substring(0, 11); // PayTR limiti
      
      // User basket için encoding düzelt
      const basketItem = `${selectedPackage.name}`;
      const userBasket = JSON.stringify([[basketItem, selectedPackage.price.toString(), 1]]);
      const encodedBasket = btoa(unescape(encodeURIComponent(userBasket)));

      console.log('🛒 User basket encoded length:', encodedBasket.length);

      // IP adresini al
      const userIP = await this.getUserIP();
      console.log('🌐 User IP:', userIP);

      const paymentData = {
        merchant_id: MERCHANT_ID,
        user_ip: userIP,
        merchant_oid: merchantOid,
        email: userEmail.trim().toLowerCase(),
        payment_amount: paymentAmount,
        user_basket: encodedBasket,
        debug_on: '1', // ✅ Debug modunu aç
        no_installment: '1',
        max_installment: '0',
        user_name: cleanUserName,
        user_address: cleanUserAddress,
        user_phone: cleanUserPhone,
        merchant_ok_url: SUCCESS_URL,
        merchant_fail_url: FAIL_URL,
        timeout_limit: '30',
        currency: 'TL',
        test_mode: '1', // ✅ Test moduna geç
        lang: 'tr'  // ✅ Dil parametresi ekle
      };

      console.log('📋 PayTR Payment Data:', {
        merchant_id: paymentData.merchant_id,
        merchant_oid: paymentData.merchant_oid,
        email: paymentData.email,
        payment_amount: paymentData.payment_amount,
        user_name: paymentData.user_name,
        test_mode: paymentData.test_mode,
        currency: paymentData.currency
      });

      // PayTR token oluştur
      const paytrToken = this.generatePaytrToken(paymentData);
      
      console.log('🔐 PayTR Token length:', paytrToken.length);

      // FormData oluştur
      const formData = new FormData();
      
      // ✅ Tüm parametreleri string olarak ekle
      Object.entries(paymentData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append('paytr_token', paytrToken);

      console.log('📤 PayTR API\'ye istek gönderiliyor...');

      // ✅ Fetch isteğini düzelt
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PayTR-Client/1.0)'
        }
      });

      console.log('📥 PayTR API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PayTR API HTTP Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // Hata mesajını daha detaylı göster
        return { 
          success: false, 
          error: `PayTR API hatası (${response.status}): ${errorText}` 
        };
      }

      const responseText = await response.text();
      console.log('📋 PayTR Raw Response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('Response Text:', responseText);
        return { 
          success: false, 
          error: 'PayTR API yanıt formatı hatalı' 
        };
      }

      console.log('📋 PayTR Parsed Result:', result);

      if (result.status === 'success') {
        console.log('✅ Payment token received');
        
        // Ödeme bilgilerini Firebase'e kaydet
        await this.savePendingPayment(jobId, packageId, merchantOid, selectedPackage.price);
        
        // PayTR ödeme sayfası URL'sini oluştur
        const paymentUrl = result.token 
          ? `https://www.paytr.com/odeme/guvenli/${result.token}`
          : null;
        
        console.log('🔗 Payment URL:', paymentUrl);

        return {
          success: true,
          token: result.token,
          paymentUrl
        };
      } else {
        console.error('❌ PayTR API Error:', result);
        return {
          success: false,
          error: result.reason || result.err_msg || 'Ödeme oluşturulamadı'
        };
      }
    } catch (error) {
      console.error('❌ Payment creation error:', error);
      return {
        success: false,
        error: `Ödeme işlemi hatası: ${error.message}`
      };
    }
  }

  private async getUserIP(): Promise<string> {
    try {
      // ✅ Alternatif IP servisleri dene
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://api.my-ip.io/ip.json', 
        'https://ipinfo.io/json'
      ];

      for (const service of ipServices) {
        try {
          console.log(`🌐 IP servisi deneniyor: ${service}`);
          const response = await fetch(service, { timeout: 5000 });
          if (response.ok) {
            const data = await response.json();
            const ip = data.ip || data.query || data.origin;
            if (ip) {
              console.log('✅ IP adresi alındı:', ip);
              return ip;
            }
          }
        } catch (serviceError) {
          console.warn(`⚠️ IP servisi hatası: ${service}`, serviceError);
          continue;
        }
      }
      
      console.log('⚠️ Hiçbir IP servisi çalışmadı, varsayılan IP kullanılıyor');
      return '88.247.134.18'; // ✅ Türkiye IP adresi
    } catch (error) {
      console.error('❌ IP alma hatası:', error);
      return '88.247.134.18';
    }
  }

  private async savePendingPayment(
    jobId: string,
    packageId: string,
    merchantOid: string,
    amount: number
  ): Promise<void> {
    try {
      const { ref, set } = await import('firebase/database');
      const { db } = await import('../lib/firebase');
      
      const paymentRef = ref(db, `pending_payments/${merchantOid}`);
      await set(paymentRef, {
        jobId,
        packageId,
        amount,
        status: 'pending',
        createdAt: Date.now(),
        merchantOid
      });
      
      console.log('✅ Pending payment saved:', merchantOid);
    } catch (error) {
      console.error('❌ Firebase save error:', error);
    }
  }

  async verifyPayment(merchantOid: string): Promise<boolean> {
    try {
      const { ref, get } = await import('firebase/database');
      const { db } = await import('../lib/firebase');
      
      const paymentRef = ref(db, `pending_payments/${merchantOid}`);
      const snapshot = await get(paymentRef);
      
      return snapshot.exists() && snapshot.val().status === 'completed';
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();