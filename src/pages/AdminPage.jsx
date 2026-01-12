/**
 * ==========================================
 * AdminPage - 後台管理主頁面
 * ==========================================
 * 
 * 功能說明：
 * - 後台管理介面框架
 * - 側邊欄導航
 * - 各編輯區塊整合
 * 
 * 路由：/admin
 */

import { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Link as LinkIcon,
    Share2,
    Palette,
    Eye,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileEditor from '../components/admin/ProfileEditor';
import LinksEditor from '../components/admin/LinksEditor';
import SocialEditor from '../components/admin/SocialEditor';
import ThemeEditor from '../components/admin/ThemeEditor';

const AdminPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // 側邊欄選單項目
    const menuItems = [
        { id: 'profile', label: '基本資料', icon: User },
        { id: 'links', label: '快速連結', icon: LinkIcon },
        { id: 'socials', label: '社群連結', icon: Share2 },
        { id: 'theme', label: '主題設定', icon: Palette },
    ];

    /**
     * 處理登出
     */
    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('登出失敗：', error);
        }
    };

    /**
     * 開啟前台預覽
     */
    const handlePreview = () => {
        window.open('/', '_blank');
    };

    /**
     * 渲染目前選中的編輯區塊
     */
    const renderEditor = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileEditor />;
            case 'links':
                return <LinksEditor />;
            case 'socials':
                return <SocialEditor />;
            case 'theme':
                return <ThemeEditor />;
            default:
                return <ProfileEditor />;
        }
    };

    return (
        <div className="admin-layout">
            {/* 側邊欄 */}
            <motion.aside
                className="admin-sidebar"
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Logo */}
                <div className="admin-sidebar__logo">
                    <div className="admin-sidebar__logo-icon">AC</div>
                    <span className="admin-sidebar__logo-text">極速名片</span>
                </div>

                {/* 導航選單 */}
                <nav className="admin-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.id}
                                className={`admin-nav__item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* 底部操作區 */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-bg-tertiary)' }}>
                    {/* 預覽按鈕 */}
                    <motion.button
                        className="admin-nav__item"
                        onClick={handlePreview}
                        whileHover={{ x: 4 }}
                    >
                        <Eye />
                        <span>預覽名片</span>
                    </motion.button>

                    {/* 登出按鈕 */}
                    <motion.button
                        className="admin-nav__item"
                        onClick={handleSignOut}
                        whileHover={{ x: 4 }}
                        style={{ color: 'var(--color-error)' }}
                    >
                        <LogOut />
                        <span>登出</span>
                    </motion.button>
                </div>

                {/* 使用者資訊 */}
                {user && (
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <img
                            src={user.photoURL || 'https://via.placeholder.com/32'}
                            alt={user.displayName}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user.displayName || '使用者'}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--color-text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user.email}
                            </div>
                        </div>
                    </div>
                )}
            </motion.aside>

            {/* 主內容區 */}
            <main className="admin-main">
                {/* 頁面標題 */}
                <div className="admin-header">
                    <h1 className="admin-header__title">
                        {menuItems.find(m => m.id === activeTab)?.label || '後台管理'}
                    </h1>
                    <div className="admin-header__actions">
                        <motion.button
                            className="admin-button admin-button--secondary"
                            onClick={handlePreview}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Eye style={{ width: 18, height: 18 }} />
                            預覽
                        </motion.button>
                    </div>
                </div>

                {/* 編輯區塊 */}
                {renderEditor()}
            </main>
        </div>
    );
};

export default AdminPage;
