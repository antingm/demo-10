/**
 * ==========================================
 * ProfileContext - 個人資料狀態管理
 * ==========================================
 * 
 * 功能說明：
 * - 管理 Bio-Link 頁面資料
 * - 從 Firestore 讀取/儲存資料
 * - 提供即時更新功能
 * 
 * 使用方式：
 * const { profile, loading, updateProfile } = useProfile();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// 建立 Context
const ProfileContext = createContext(null);

// 預設資料結構
const defaultProfile = {
    name: '您的名字',
    title: '您的職稱',
    bio: '用一句話介紹自己',
    avatarUrl: '',
    socials: [
        { platform: 'line', url: '', enabled: true },
        { platform: 'instagram', url: '', enabled: true },
        { platform: 'facebook', url: '', enabled: false },
    ],
    links: [
        {
            id: 'link-1',
            icon: '📞',
            title: '預約諮詢',
            description: '立即預約免費諮詢',
            url: '',
            enabled: true,
            order: 0
        },
        {
            id: 'link-2',
            icon: '🛒',
            title: '線上商店',
            description: '瀏覽商品與服務',
            url: '',
            enabled: true,
            order: 1
        },
    ],
    contact: {
        phone: '',
        email: '',
        address: '',
        showPhone: true,
        showEmail: true,
        showAddress: false
    },
    theme: {
        primaryColor: '#10B981',
        accentColor: '#D4AF37',
        template: 'modern'
    },
    seo: {
        title: '',
        description: '',
        ogImage: ''
    }
};

/**
 * ProfileProvider - 個人資料提供者
 */
export const ProfileProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(defaultProfile);
    const [loading, setLoading] = useState(true);

    // 監聽個人資料變化（即時同步）
    useEffect(() => {
        // 如果沒有登入，嘗試載入公開的 demo 資料
        if (!isAuthenticated) {
            loadDemoProfile();
            return;
        }

        // 已登入，監聽使用者自己的資料
        const docRef = doc(db, 'profiles', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile({ ...defaultProfile, ...docSnap.data() });
            } else {
                // 首次建立，使用預設資料
                setProfile(defaultProfile);
            }
            setLoading(false);
        }, (error) => {
            console.error('載入個人資料失敗：', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, isAuthenticated]);

    /**
     * 載入 Demo 展示資料（前台公開頁面用）
     * 直接使用本地資料，不連線 Firestore
     */
    const loadDemoProfile = () => {
        // 直接使用內建的展示資料（不需要 Firebase）
        setProfile({
            ...defaultProfile,
            name: '小美好物',
            title: '精選好物 | 品質生活',
            bio: '每週精選全球好物，讓生活更有質感 ✨',
            avatarUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop&crop=center',
            socials: [
                { platform: 'line', url: 'https://line.me/ti/p/~demo', enabled: true },
                { platform: 'instagram', url: 'https://instagram.com/demo', enabled: true },
                { platform: 'facebook', url: 'https://facebook.com/demo', enabled: true },
            ],
            // 商品列表（新增）
            products: [
                {
                    id: 'prod-1',
                    name: '手工陶瓷咖啡杯',
                    price: 580,
                    originalPrice: 780,
                    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
                    tag: 'hot',
                    url: 'https://shopee.tw/demo',
                    enabled: true
                },
                {
                    id: 'prod-2',
                    name: '北歐風格香氛蠟燭',
                    price: 420,
                    image: 'https://images.unsplash.com/photo-1602607700908-0014ffb1da15?w=400&h=400&fit=crop',
                    tag: 'new',
                    url: 'https://shopee.tw/demo',
                    enabled: true
                },
                {
                    id: 'prod-3',
                    name: '天然亞麻餐墊組',
                    price: 350,
                    originalPrice: 450,
                    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
                    tag: 'sale',
                    url: 'https://shopee.tw/demo',
                    enabled: true
                },
                {
                    id: 'prod-4',
                    name: '日式簡約花瓶',
                    price: 680,
                    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
                    url: 'https://shopee.tw/demo',
                    enabled: true
                },
            ],
            links: [
                {
                    id: 'link-1',
                    icon: '🛒',
                    title: '官方商城',
                    description: '全館商品 85 折起',
                    url: 'https://shopee.tw/demo',
                    enabled: true,
                    order: 0
                },
                {
                    id: 'link-2',
                    icon: '💬',
                    title: 'LINE 客服諮詢',
                    description: '專人為您服務',
                    url: 'https://line.me/ti/p/~demo',
                    enabled: true,
                    order: 1
                },
            ],
            contact: {
                phone: '0800-123-456',
                email: 'service@demo-shop.com',
                address: '台北市信義區信義路五段7號',
                showPhone: true,
                showEmail: true,
                showAddress: false
            }
        });
        setLoading(false);
    };

    /**
     * 更新個人資料
     * @param {Object} updates - 要更新的欄位
     */
    const updateProfile = async (updates) => {
        if (!isAuthenticated || !user) {
            console.error('必須登入才能更新資料');
            return;
        }

        try {
            const docRef = doc(db, 'profiles', user.uid);
            const newProfile = {
                ...profile,
                ...updates,
                updatedAt: new Date()
            };

            await setDoc(docRef, newProfile, { merge: true });
            setProfile(newProfile);
        } catch (error) {
            console.error('更新個人資料失敗：', error);
            throw error;
        }
    };

    /**
     * 更新連結列表
     * @param {Array} links - 新的連結陣列
     */
    const updateLinks = async (links) => {
        await updateProfile({ links });
    };

    /**
     * 更新社群連結
     * @param {Array} socials - 新的社群連結陣列
     */
    const updateSocials = async (socials) => {
        await updateProfile({ socials });
    };

    // Context 值
    const value = {
        profile,
        loading,
        updateProfile,
        updateLinks,
        updateSocials,
        defaultProfile
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

/**
 * useProfile Hook - 取得個人資料
 * @returns {Object} 個人資料與更新方法
 */
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile 必須在 ProfileProvider 內使用');
    }
    return context;
};

export default ProfileContext;
