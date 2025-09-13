// Bu dosya, bir Node.js/Express.js sunucusunda çalışmalıdır.

import express from 'express';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, set, get } from 'firebase/database';
// Firebase admin SDK'yı kullanmak daha güvenlidir.
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase as getAdminDatabase } from 'firebase-admin/database';

// .env dosyasından gizli bilgileri okuyun
// process.env.VITE_PYTR_MERCHANT_ID yerine process.env.PYTR_MERCHANT_ID kullanılmalı
const MERCHANT_ID = process.env.PYTR_MERCHANT_ID;
const MERCHANT_KEY = process.env.PYTR_MERCHANT_KEY;
const MERCHANT_SALT = process.env.PYTR_MERCHANT_SALT;
const API_URL = 'https://www.paytr.com/odeme/api/get-token';
const SUCCESS_URL = process.env.PYTR_SUCCESS_URL;
const FAIL_URL = process.env.PYTR_FAIL_URL;

// Firebase Admin SDK'sını başlatın (Bu, sunucu tarafı için gereklidir)
// serviceAccount.json dosyasını kendi Firebase projenizden indirmelisiniz
// const serviceAccount = require('./path/to/your/serviceAccountKey.json');
// initializeApp({
//   credential: cert(serviceAccount),
//   databaseURL: 'https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com'
// });
// const db = getAdminDatabase();

export const paymentPackages = [
  {
    id: 'daily',
    name: '1 Günlük Öne Çıkarma',
    duration: 1,
    price: 9.99,
    features: ['İlanınız 1 gün boyunca öne çıkar', 'Daha fazla görüntülenme', 'Hızlı başvuru alın']
  },
  {
    id: 'weekly',
    name: '1 Haftalık Öne Çıkarma',
    duration: 7,
    price: 29.99,
    features: ['İlanınız 7 gün boyunca öne çıkar', '3x daha fazla görüntülenme', 'Premium rozet', 'Öne çıkan renk'],
    popular: true
  },
  {
    id: 'monthly',
    name: '1 Aylık Öne Çıkarma',
    duration: 30,
    price: 89.99,
    features: ['İlanınız 30 gün boyunca öne çıkar', '5x daha fazla görüntülenme', 'Premium rozet', 'Öne çıkan renk', 'Öncelikli destek']
  }
];

export class PaymentService {
  /**
   * PayTR için doğru token'ı oluşturur.
   * @private
   * @param {object} data - API isteği için gerekli veriler.
   * @returns {string} - Oluşturulan hash string'i.
   */
  private generatePaytrToken(data: any): string {
    // PayTR'nin istediği sıralama ile hash string'i oluştur
    const hashStr = `${data.merchant_id}${data.user_ip}${data.merchant_oid}${data.email}${data.payment_amount}${data.user_basket}${data.no_installment}${data.max_installment}${data.user_name}${data.user_address}${data.user_phone}${data.merchant_ok_url}${data.merchant_fail_url}${data.timeout_limit}${data.currency}${data.test_mode}`;
    
    // PayTR'nin dökümantasyonundaki doğru hash algoritması
    // MD5(birleştirilmiş string) + MERCHANT_SALT => SHA256(bu sonuç + MERCHANT_KEY)
    const md5Hash = CryptoJS.MD5(hashStr + MERCHANT_SALT).toString();
    const finalToken = CryptoJS.SHA256(md5Hash + MERCHANT_KEY).toString();

    console.log('✅ PayTR token oluşturuldu');
    return finalToken;
  }

  /**
   * Frontend'den gelen isteği işleyerek PayTR'a ödeme talebi gönderir.
   * @param {string} jobId - İlan ID'si.
   * @param {string} packageId - Seçilen paket ID'si.
   * @param {string} userEmail - Kullanıcı e-postası.
   * @param {string} userName - Kullanıcı adı.
   * @param {string} userPhone - Kullanıcı telefonu.
   * @param {string} userAddress - Kullanıcı adresi.
   * @param {string} userIP - Kullanıcının gerçek IP adresi (backend'den alınır).
   */
  async createPayment(
    jobId: string,
    packageId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    userAddress: string,
    userIP: string
  ): Promise<{ success: boolean; token?: string; iframeToken?: string; error?: string }> {
    try {
      if (!userEmail || !userName || !userPhone || !userAddress || !userIP) {
        throw new Error('Eksik kullanıcı veya IP bilgisi.');
      }
      
      const selectedPackage = paymentPackages.find(p => p.id === packageId);
      if (!selectedPackage) {
        throw new Error('Geçersiz paket seçimi.');
      }

      // Güvenli ve benzersiz merchant_oid oluşturma
      const merchantOid = `${jobId.replace(/[^a-zA-Z0-9]/g, '')}-${uuidv4()}`;
      const paymentAmount = Math.round(selectedPackage.price * 100);

      // Verileri PayTR için hazırlama
      const cleanUserName = userName.trim().replace(/[^\w\s]/g, '');
      const cleanUserAddress = userAddress.trim().replace(/[^\w\s]/g, '');
      const cleanUserPhone = userPhone.replace(/[^0-9]/g, '');

      const basketItem = `${selectedPackage.name} - İlan: ${jobId}`;
      const userBasket = JSON.stringify([[basketItem, selectedPackage.price, 1]]);

      const paymentData = {
        merchant_id: MERCHANT_ID,
        user_ip: userIP, // Kullanıcının gerçek IP adresi
        merchant_oid: merchantOid,
        email: userEmail.trim(),
        payment_amount: paymentAmount.toString(),
        // Türkçe karakter desteği için encodeURIComponent kullanımı
        user_basket: btoa(encodeURIComponent(userBasket)), 
        debug_on: '0',
        no_installment: '1',
        max_installment: '0',
        user_name: cleanUserName,
        user_address: cleanUserAddress,
        user_phone: cleanUserPhone,
        merchant_ok_url: `${SUCCESS_URL}?merchant_oid=${merchantOid}`,
        merchant_fail_url: `${FAIL_URL}?merchant_oid=${merchantOid}`,
        timeout_limit: '30',
        currency: 'TL',
        test_mode: '0'
      };

      const paytrToken = this.generatePaytrToken(paymentData);

      const formData = new URLSearchParams();
      Object.entries(paymentData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('paytr_token', paytrToken);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Ödeme bilgilerini Firebase'e kaydet
        // Bu kısımda Firebase Admin SDK kullanılmalı.
        // await this.savePendingPayment(jobId, packageId, merchantOid, selectedPackage.price);

        return {
          success: true,
          token: result.token,
          iframeToken: result.iframe_token,
        };
      } else {
        throw new Error(result.reason || 'Ödeme oluşturulamadı.');
      }
    } catch (error: any) {
      console.error('❌ Ödeme oluşturma hatası:', error);
      return { success: false, error: error.message || 'Bir hata oluştu.' };
    }
  }

  // Firebase Admin SDK kullanımı için örnek
  async savePendingPayment(jobId: string, packageId: string, merchantOid: string, amount: number): Promise<void> {
    const paymentRef = ref(db, `pending_payments/${merchantOid}`);
    await set(paymentRef, {
      jobId,
      packageId,
      amount,
      status: 'pending',
      createdAt: Date.now(),
      merchantOid
    });
  }

  // Frontend'den gelen ödeme doğrulaması isteği
  async verifyPayment(merchantOid: string): Promise<boolean> {
    const paymentRef = ref(db, `pending_payments/${merchantOid}`);
    const snapshot = await get(paymentRef);
    return snapshot.exists() && snapshot.val().status === 'completed';
  }
}

// Frontend'de bu servisi kullanmak için örnek bir API uç noktası
// Bu kod Express.js ile bir API oluşturur
/*
const app = express();
app.use(express.json());

app.post('/api/create-payment', async (req, res) => {
    try {
        const { jobId, packageId, userEmail, userName, userPhone, userAddress } = req.body;
        const userIP = req.ip || '127.0.0.1'; // Express'ten kullanıcı IP'sini alma

        const paymentService = new PaymentService();
        const result = await paymentService.createPayment(
            jobId,
            packageId,
            userEmail,
            userName,
            userPhone,
            userAddress,
            userIP
        );

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Sunucu tarafında bir hata oluştu.' });
    }
});
app.listen(3000, () => console.log('Backend server running on port 3000'));
*/