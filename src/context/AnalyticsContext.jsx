/**
 * ==========================================
 * AnalyticsContext - 數據分析狀態管理
 * ==========================================
 * 
 * 功能說明：
 * - 追蹤頁面瀏覽
 * - 追蹤連結點擊
 * - 提供統計數據
 * 
 * 企業版功能
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext(null);

/**
 * AnalyticsProvider - 分析提供者
 */
export const AnalyticsProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({
        totalViews: 0,
        totalClicks: 0,
        todayViews: 0,
        todayClicks: 0,
        recentEvents: []
    });
    const [loading, setLoading] = useState(true);

    /**
     * 記錄事件
     */
    const trackEvent = useCallback(async (eventType, data = {}) => {
        try {
            const eventData = {
                type: eventType,
                timestamp: Timestamp.now(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                ...data
            };

            // 如果有登入用戶，關聯到用戶
            if (user) {
                eventData.userId = user.uid;
            }

            await addDoc(collection(db, 'analytics'), eventData);
        } catch (error) {
            console.error('記錄事件失敗：', error);
        }
    }, [user]);

    /**
     * 追蹤頁面瀏覽
     */
    const trackPageView = useCallback((pageId = 'main') => {
        trackEvent('page_view', { pageId });
    }, [trackEvent]);

    /**
     * 追蹤連結點擊
     */
    const trackLinkClick = useCallback((linkId, linkTitle, linkUrl) => {
        trackEvent('link_click', { linkId, linkTitle, linkUrl });
    }, [trackEvent]);

    /**
     * 追蹤社群點擊
     */
    const trackSocialClick = useCallback((platform, url) => {
        trackEvent('social_click', { platform, url });
    }, [trackEvent]);

    /**
     * 追蹤商品點擊
     */
    const trackProductClick = useCallback((productId, productName) => {
        trackEvent('product_click', { productId, productName });
    }, [trackEvent]);

    /**
     * 載入統計數據
     */
    const loadStats = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Timestamp.fromDate(today);

            // 取得總瀏覽次數
            const viewsQuery = query(
                collection(db, 'analytics'),
                where('userId', '==', user.uid),
                where('type', '==', 'page_view')
            );
            const viewsSnap = await getDocs(viewsQuery);
            const totalViews = viewsSnap.size;

            // 取得總點擊次數
            const clicksQuery = query(
                collection(db, 'analytics'),
                where('userId', '==', user.uid),
                where('type', 'in', ['link_click', 'social_click', 'product_click'])
            );
            const clicksSnap = await getDocs(clicksQuery);
            const totalClicks = clicksSnap.size;

            // 取得今日瀏覽
            const todayViewsQuery = query(
                collection(db, 'analytics'),
                where('userId', '==', user.uid),
                where('type', '==', 'page_view'),
                where('timestamp', '>=', todayTimestamp)
            );
            const todayViewsSnap = await getDocs(todayViewsQuery);
            const todayViews = todayViewsSnap.size;

            // 取得今日點擊
            const todayClicksQuery = query(
                collection(db, 'analytics'),
                where('userId', '==', user.uid),
                where('type', 'in', ['link_click', 'social_click', 'product_click']),
                where('timestamp', '>=', todayTimestamp)
            );
            const todayClicksSnap = await getDocs(todayClicksQuery);
            const todayClicks = todayClicksSnap.size;

            // 取得最近事件
            const recentQuery = query(
                collection(db, 'analytics'),
                where('userId', '==', user.uid),
                orderBy('timestamp', 'desc'),
                limit(50)
            );
            const recentSnap = await getDocs(recentQuery);
            const recentEvents = recentSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate()
            }));

            setStats({
                totalViews,
                totalClicks,
                todayViews,
                todayClicks,
                recentEvents
            });
        } catch (error) {
            console.error('載入統計數據失敗：', error);
        } finally {
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const value = {
        stats,
        loading,
        trackPageView,
        trackLinkClick,
        trackSocialClick,
        trackProductClick,
        refreshStats: loadStats
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

/**
 * useAnalytics Hook
 */
export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics 必須在 AnalyticsProvider 內使用');
    }
    return context;
};

export default AnalyticsContext;
