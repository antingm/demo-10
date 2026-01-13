/**
 * ==========================================
 * PlanContext - 方案等級狀態管理
 * ==========================================
 * 
 * 功能說明：
 * - 管理用戶訂閱方案
 * - 功能權限檢查
 * - 方案限制設定
 * 
 * 方案等級：
 * - free: 免費版
 * - pro: 專業版 (NT$3,600)
 * - enterprise: 企業版 (NT$9,900)
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const PlanContext = createContext(null);

// 方案定義
export const PLANS = {
    free: {
        id: 'free',
        name: '免費版',
        price: 0,
        priceLabel: '免費',
        features: {
            maxLinks: 3,
            maxProducts: 2,
            customThemes: false,
            analytics: false,
            multiPage: false,
            lineNotify: false,
            watermark: true,
            qrCodeColors: 2,
        },
        description: '適合個人試用'
    },
    pro: {
        id: 'pro',
        name: '專業版',
        price: 3600,
        priceLabel: 'NT$3,600',
        priceNote: '終身買斷',
        features: {
            maxLinks: 999,
            maxProducts: 999,
            customThemes: true,
            analytics: false,
            multiPage: false,
            lineNotify: false,
            watermark: false,
            qrCodeColors: 7,
        },
        description: '適合個人品牌與小商家',
        popular: true
    },
    enterprise: {
        id: 'enterprise',
        name: '企業版',
        price: 9900,
        priceLabel: 'NT$9,900',
        priceNote: '終身買斷',
        features: {
            maxLinks: 999,
            maxProducts: 999,
            customThemes: true,
            analytics: true,
            multiPage: true,
            lineNotify: true,
            watermark: false,
            qrCodeColors: 999,
        },
        description: '適合企業與團隊'
    }
};

// 功能名稱對照
export const FEATURE_LABELS = {
    maxLinks: '快速連結數量',
    maxProducts: '商品數量',
    customThemes: '自訂主題',
    analytics: '數據分析',
    multiPage: '多頁面支援',
    lineNotify: 'LINE 通知',
    watermark: '無浮水印',
    qrCodeColors: 'QR Code 顏色',
};

/**
 * PlanProvider - 方案提供者
 */
export const PlanProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [userPlan, setUserPlan] = useState('free');
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 監聽用戶方案
    useEffect(() => {
        if (!isAuthenticated || !user) {
            setUserPlan('free');
            setPlanData(PLANS.free);
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'subscriptions', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserPlan(data.plan || 'free');
                setPlanData(PLANS[data.plan] || PLANS.free);
            } else {
                setUserPlan('free');
                setPlanData(PLANS.free);
            }
            setLoading(false);
        }, (error) => {
            console.error('載入方案資料失敗：', error);
            setUserPlan('free');
            setPlanData(PLANS.free);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, isAuthenticated]);

    /**
     * 檢查功能是否可用
     * @param {string} feature - 功能名稱
     * @returns {boolean}
     */
    const canUse = (feature) => {
        if (!planData) return false;
        const value = planData.features[feature];
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value > 0;
        return false;
    };

    /**
     * 檢查數量限制
     * @param {string} feature - 功能名稱
     * @param {number} currentCount - 目前數量
     * @returns {boolean}
     */
    const checkLimit = (feature, currentCount) => {
        if (!planData) return false;
        const limit = planData.features[feature];
        if (typeof limit === 'number') return currentCount < limit;
        return true;
    };

    /**
     * 取得功能限制數量
     * @param {string} feature - 功能名稱
     * @returns {number|boolean}
     */
    const getLimit = (feature) => {
        if (!planData) return 0;
        return planData.features[feature];
    };

    /**
     * 升級方案（Demo 用，實際應整合金流）
     * @param {string} planId - 方案 ID
     */
    const upgradePlan = async (planId) => {
        if (!isAuthenticated || !user) {
            throw new Error('請先登入');
        }

        if (!PLANS[planId]) {
            throw new Error('無效的方案');
        }

        try {
            const docRef = doc(db, 'subscriptions', user.uid);
            await setDoc(docRef, {
                plan: planId,
                upgradedAt: new Date(),
                userId: user.uid
            }, { merge: true });
        } catch (error) {
            console.error('升級方案失敗：', error);
            throw error;
        }
    };

    const value = {
        userPlan,
        planData,
        loading,
        plans: PLANS,
        canUse,
        checkLimit,
        getLimit,
        upgradePlan,
        isPro: userPlan === 'pro' || userPlan === 'enterprise',
        isEnterprise: userPlan === 'enterprise',
    };

    return (
        <PlanContext.Provider value={value}>
            {children}
        </PlanContext.Provider>
    );
};

/**
 * usePlan Hook
 */
export const usePlan = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error('usePlan 必須在 PlanProvider 內使用');
    }
    return context;
};

export default PlanContext;
