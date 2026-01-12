/**
 * ==========================================
 * Firebase 初始化設定
 * ==========================================
 * 
 * 功能說明：
 * - 初始化 Firebase App
 * - 匯出 Auth、Firestore、Storage 實例
 * 
 * 注意事項：
 * 部署前請替換為您自己的 Firebase 專案設定
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 專案設定
// ⚠️ 部署前請替換為您的 Firebase 專案設定
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出 Firebase 服務實例
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google 登入提供者
export const googleProvider = new GoogleAuthProvider();

export default app;
