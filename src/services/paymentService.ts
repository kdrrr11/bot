// Bu dosya, bir Node.js/Express.js sunucusunda çalışmalıdır.

import express from 'express';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import validator from 'validator';

// Environment variables validation
const requiredEnvVars = [
  'PAYTR_MERCHANT_ID',
  'PAYTR_MERCHANT_KEY', 
  'PAYTR_MERCHANT_SALT',
  'PAYTR_SUCCESS_URL',
  'PAYTR_FAIL_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID!;
const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY!;
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT!;
const API_URL = 'https://www.paytr.com/odeme/api/get-token';
const SUCCESS_URL = process.env.PAYTR_SUCCESS_URL!;
const FAIL_URL = process.env.PAYTR_FAIL_URL!;

// Firebase Admin SDK initialization
// Uncomment and configure with your service account
/*
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://YOUR_FIREBASE_PROJECT_ID.firebaseio.com'
});
*/
const db = getDatabase();

// Types
interface PaymentPackage {
  id: string;
  name: string;
  duration: number;
  price: number;
  features: string[];
  popular?: boolean;
}

interface PaymentResult {
  success: boolean;
  token?: string;
  iframeToken?: string;
  error?: string;
}

interface PendingPayment {
  jobId: string;
  packageId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  merchantOid: string;
}

export const paymentPackages: PaymentPackage[] = [
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
   * Kullanıcı girişlerini doğrular
   */
  private validateInputs(
    jobId: string,
    packageId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    userAddress: string,
    userIP: string
  ): void {
    if (!jobId?.trim()) throw new Error('İlan ID gerekli');
    if (!packageId?.trim()) throw new Error('Paket seçimi gerekli');
    if (!validator.isEmail(userEmail)) throw new Error('Geçerli e-posta adresi gerekli');
    if (!userName?.trim() || userName.length < 2) throw new Error('Geçerli ad soyad gerekli');
    if (!validator.isMobilePhone(userPhone, 'tr-TR')) throw new Error('Geçerli telefon numarası gerekli');
    if (!userAddress?.trim() || userAddress.length < 10) throw new Error('Detaylı adres gerekli');
    if (!validator.isIP(userIP)) throw new Error('Geçerli IP adresi gerekli');
  }

  /**
   * Kullanıcı verilerini güvenli hale getirir
   */
  private sanitizeInputs(data: {
    userName: string;
    userAddress: string;
    userPhone: string;
  }) {
    return {
      userName: validator.escape(data.userName.trim()).substring(0, 50),
      userAddress: validator.escape(data.userAddress.trim()).substring(0, 200),
      userPhone: data.userPhone.replace(/[^0-9]/g, '').substring(0, 11)
    };
  }

  /**
   * PayTR için doğru token'ı oluşturur.
   */
  private generatePaytrToken(data: any): string {
    try {
      // PayTR'nin istediği sıralama ile hash string'i oluştur
      const hashStr = `${data.merchant_id}${data.user_ip}${data.merchant_oid}${data.email}${data.payment_amount}${data.user_basket}${data.no_installment}${data.max_installment}${data.user_name}${data.user_address}${data.user_phone}${data.merchant_ok_url}${data.merchant_fail_url}${data.timeout_limit}${data.currency}${data.test_mode}`;
      
      // PayTR'nin dökümantasyonundaki doğru hash algoritması
      const md5Hash = CryptoJS.MD5(hashStr + MERCHANT_SALT).toString();
      const finalToken = CryptoJS.SHA256(md5Hash + MERCHANT_KEY).toString();

      console.log('✅ PayTR token oluşturuldu');
      return finalToken;
    } catch (error) {
      console.error('❌ Token oluşturma hatası:', error);
      throw new Error('Token oluşturulamadı');
    }
  }

  /**
   * Frontend'den gelen isteği işleyerek PayTR'a ödeme talebi gönderir.
   */
  async createPayment(
    jobId: string,
    packageId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    userAddress: string,
    userIP: string
  ): Promise<PaymentResult> {
    try {
      // Input validation
      this.validateInputs(jobId, packageId, userEmail, userName, userPhone, userAddress, userIP);
      
      const selectedPackage = paymentPackages.find(p => p.id === packageId);
      if (!selectedPackage) {
        throw new Error('Geçersiz paket seçimi.');
      }

      // Input sanitization
      const sanitized = this.sanitizeInputs({ userName, userAddress, userPhone });

      // Güvenli ve benzersiz merchant_oid oluşturma
      const timestamp = Date.now();
      const merchantOid = `${jobId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}-${timestamp}-${uuidv4().substring(0, 8)}`;
      const paymentAmount = Math.round(selectedPackage.price * 100);

      const basketItem = `${selectedPackage.name} - İlan: ${jobId}`;
      const userBasket = JSON.stringify([[basketItem, selectedPackage.price, 1]]);

      const paymentData = {
        merchant_id: MERCHANT_ID,
        user_ip: userIP,
        merchant_oid: merchantOid,
        email: userEmail.trim().toLowerCase(),
        payment_amount: paymentAmount.toString(),
        user_basket: Buffer.from(userBasket, 'utf8').toString('base64'),
        debug_on: '0',
        no_installment: '1',
        max_installment: '0',
        user_name: sanitized.userName,
        user_address: sanitized.userAddress,
        user_phone: sanitized.userPhone,
        merchant_ok_url: `${SUCCESS_URL}?merchant_oid=${merchantOid}`,
        merchant_fail_url: `${FAIL_URL}?merchant_oid=${merchantOid}`,
        timeout_limit: '30',
        currency: 'TL',
        test_mode: process.env.NODE_ENV === 'production' ? '0' : '1'
      };

      const paytrToken = this.generatePaytrToken(paymentData);

      const formData = new URLSearchParams();
      Object.entries(paymentData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('paytr_token', paytrToken);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`PayTR API hatası: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        // Ödeme bilgilerini Firebase'e kaydet
        await this.savePendingPayment(jobId, packageId, merchantOid, selectedPackage.price);

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
      return { 
        success: false, 
        error: error.message || 'Beklenmeyen bir hata oluştu.' 
      };
    }
  }

  /**
   * Bekleyen ödeme bilgilerini Firebase'e kaydeder
   */
  async savePendingPayment(
    jobId: string, 
    packageId: string, 
    merchantOid: string, 
    amount: number
  ): Promise<void> {
    try {
      const paymentData: PendingPayment = {
        jobId,
        packageId,
        amount,
        status: 'pending',
        createdAt: Date.now(),
        merchantOid
      };

      await db.ref(`pending_payments/${merchantOid}`).set(paymentData);
      console.log('✅ Ödeme bilgisi Firebase\'e kaydedildi:', merchantOid);
    } catch (error) {
      console.error('❌ Firebase kaydetme hatası:', error);
      throw new Error('Ödeme bilgisi kaydedilemedi');
    }
  }

  /**
   * Ödeme durumunu doğrular
   */
  async verifyPayment(merchantOid: string): Promise<boolean> {
    try {
      if (!merchantOid?.trim()) {
        throw new Error('Merchant OID gerekli');
      }

      const snapshot = await db.ref(`pending_payments/${merchantOid}`).once('value');
      const paymentData = snapshot.val() as PendingPayment | null;
      
      return paymentData?.status === 'completed';
    } catch (error) {
      console.error('❌ Ödeme doğrulama hatası:', error);
      return false;
    }
  }

  /**
   * Ödeme durumunu günceller
   */
  async updatePaymentStatus(
    merchantOid: string, 
    status: 'completed' | 'failed'
  ): Promise<void> {
    try {
      await db.ref(`pending_payments/${merchantOid}/status`).set(status);
      await db.ref(`pending_payments/${merchantOid}/updatedAt`).set(Date.now());
      console.log(`✅ Ödeme durumu güncellendi: ${merchantOid} -> ${status}`);
    } catch (error) {
      console.error('❌ Ödeme durumu güncelleme hatası:', error);
      throw error;
    }
  }
}

// Express.js API endpoint example
export function createPaymentRoutes(app: express.Application): void {
  const paymentService = new PaymentService();

  app.post('/api/create-payment', async (req, res) => {
    try {
      const { jobId, packageId, userEmail, userName, userPhone, userAddress } = req.body;
      
      // Get real user IP
      const userIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     '127.0.0.1';

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
    } catch (error: any) {
      console.error('❌ API Hatası:', error);
      res.status(500).json({ error: 'Sunucu hatası oluştu.' });
    }
  });

  // PayTR callback endpoint
  app.post('/api/payment-callback', async (req, res) => {
    try {
      const { merchant_oid, status, total_amount, hash } = req.body;
      
      // PayTR hash doğrulaması burada yapılmalı
      // Hash = MD5(merchant_oid + merchant_salt + status + total_amount)
      
      if (status === 'success') {
        await paymentService.updatePaymentStatus(merchant_oid, 'completed');
      } else {
        await paymentService.updatePaymentStatus(merchant_oid, 'failed');
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Callback hatası:', error);
      res.status(500).send('ERROR');
    }
  });
}