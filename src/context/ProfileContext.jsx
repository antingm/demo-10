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
     */
    const loadDemoProfile = async () => {
        try {
            // 嘗試載入站點設定中的 demo 資料
            const demoRef = doc(db, 'settings', 'demo');
            const demoSnap = await getDoc(demoRef);

            if (demoSnap.exists()) {
                setProfile({ ...defaultProfile, ...demoSnap.data() });
            } else {
                // 使用內建的展示資料
                setProfile({
                    ...defaultProfile,
                    name: '王小明',
                    title: '專業攝影師 | 品牌顧問',
                    bio: '用影像說故事，讓品牌被看見',
                    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
                    socials: [
                        { platform: 'line', url: 'https://line.me/ti/p/~demo', enabled: true },
                        { platform: 'instagram', url: 'https://instagram.com/demo', enabled: true },
                        { platform: 'facebook', url: 'https://facebook.com/demo', enabled: true },
                    ],
                    links: [
                        {
                            id: 'link-1',
                            icon: '📞',
                            title: '預約諮詢',
                            description: '立即預約免費拍攝諮詢',
                            url: 'https://calendly.com/demo',
                            enabled: true,
                            order: 0
                        },
                        {
                            id: 'link-2',
                            icon: '🛒',
                            title: '作品集',
                            description: '瀏覽我的攝影作品',
                            url: 'https://behance.net/demo',
                            enabled: true,
                            order: 1
                        },
                        {
                            id: 'link-3',
                            icon: '📍',
                            title: '工作室位置',
                            description: '台北市信義區',
                            url: 'https://maps.google.com',
                            enabled: true,
                            order: 2
                        },
                        {
                            id: 'link-4',
                            icon: '💼',
                            title: '品牌顧問服務',
                            description: '一對一品牌策略諮詢',
                            url: 'https://example.com',
                            enabled: true,
                            order: 3
                        },
                    ],
                    contact: {
                        phone: '0912-345-678',
                        email: 'hello@example.com',
                        address: '台北市信義區信義路五段7號',
                        showPhone: true,
                        showEmail: true,
                        showAddress: true
                    }
                });
            }
        } catch (error) {
            console.error('載入 Demo 資料失敗：', error);
        } finally {
            setLoading(false);
        }
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
