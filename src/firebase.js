/**
 * ==========================================
 * Firebase 初始化設定
 * ==========================================
 * 
 * 功能說明：
 * - 初始化 Firebase App
 * - 匯出 Auth、Firestore、Storage 實例
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase 專案設定
const firebaseConfig = {
    apiKey: "AIzaSyBDbGxcm8Vlys_tBrKgtMrE7fBmcv1Dje8",
    authDomain: "anting-card.firebaseapp.com",
    projectId: "anting-card",
    storageBucket: "anting-card.firebasestorage.app",
    messagingSenderId: "34356453408",
    appId: "1:34356453408:web:ec060c911b20ca018edc45",
    measurementId: "G-2FZ879JEJ2"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出 Firebase 服務實例
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Google 登入提供者
export const googleProvider = new GoogleAuthProvider();

export default app;
