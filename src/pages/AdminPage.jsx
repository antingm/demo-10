/**
 * ==========================================
 * AdminPage - 後台管理主頁面（含即時預覽）
 * ==========================================
 * 
 * 功能說明：
 * - 後台管理介面框架
 * - 側邊欄導航
 * - 右側即時預覽面板
 * - 各編輯區塊整合
 * 
 * 路由：/admin
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Link as LinkIcon,
    Share2,
    Palette,
    Eye,
    EyeOff,
    LogOut,
    Smartphone,
    ExternalLink,
    ShoppingBag,
    QrCode,
    BarChart2,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import ProfileEditor from '../components/admin/ProfileEditor';
import LinksEditor from '../components/admin/LinksEditor';
import SocialEditor from '../components/admin/SocialEditor';
import ThemeEditor from '../components/admin/ThemeEditor';
import ProductEditor from '../components/admin/ProductEditor';
import QRCodeGenerator from '../components/admin/QRCodeGenerator';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import LineNotification from '../components/admin/LineNotification';

// 引入前台元件用於預覽
import Header from '../components/Header';
import SocialLinks from '../components/SocialLinks';
import QuickLinks from '../components/QuickLinks';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';

const AdminPage = () => {
    const { user, signOut } = useAuth();
    const { profile } = useProfile();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPreview, setShowPreview] = useState(true);

    // 側邊欄選單項目
    const menuItems = [
        { id: 'profile', label: '基本資料', icon: User },
        { id: 'products', label: '商品管理', icon: ShoppingBag },
        { id: 'links', label: '快速連結', icon: LinkIcon },
        { id: 'socials', label: '社群連結', icon: Share2 },
        { id: 'theme', label: '主題設定', icon: Palette },
        { id: 'qrcode', label: 'QR Code', icon: QrCode },
        { id: 'analytics', label: '數據分析', icon: BarChart2 },
        { id: 'line', label: 'LINE 通知', icon: Bell },
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
     * 開啟新分頁預覽
     */
    const handleOpenPreview = () => {
        window.open('/', '_blank');
    };

    /**
     * 切換預覽面板顯示
     */
    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    /**
     * 渲染目前選中的編輯區塊
     */
    const renderEditor = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileEditor />;
            case 'products':
                return <ProductEditor />;
            case 'links':
                return <LinksEditor />;
            case 'socials':
                return <SocialEditor />;
            case 'theme':
                return <ThemeEditor />;
            case 'qrcode':
                return <QRCodeGenerator />;
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'line':
                return <LineNotification />;
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
                    {/* 切換預覽面板 */}
                    <motion.button
                        className={`admin-nav__item ${showPreview ? 'active' : ''}`}
                        onClick={togglePreview}
                        whileHover={{ x: 4 }}
                    >
                        {showPreview ? <EyeOff /> : <Eye />}
                        <span>{showPreview ? '隱藏預覽' : '顯示預覽'}</span>
                    </motion.button>

                    {/* 新分頁預覽 */}
                    <motion.button
                        className="admin-nav__item"
                        onClick={handleOpenPreview}
                        whileHover={{ x: 4 }}
                    >
                        <ExternalLink />
                        <span>新分頁預覽</span>
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
            <main className="admin-main" style={{
                marginRight: showPreview ? '380px' : '0',
                transition: 'margin-right 0.3s ease'
            }}>
                {/* 頁面標題 */}
                <div className="admin-header">
                    <h1 className="admin-header__title">
                        {menuItems.find(m => m.id === activeTab)?.label || '後台管理'}
                    </h1>
                    <div className="admin-header__actions">
                        <motion.button
                            className="admin-button admin-button--secondary"
                            onClick={togglePreview}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Smartphone style={{ width: 18, height: 18 }} />
                            {showPreview ? '隱藏預覽' : '顯示預覽'}
                        </motion.button>
                    </div>
                </div>

                {/* 編輯區塊 */}
                {renderEditor()}
            </main>

            {/* 即時預覽面板 */}
            <AnimatePresence>
                {showPreview && (
                    <motion.aside
                        className="admin-preview"
                        initial={{ x: 380, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 380, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            right: 0,
                            top: 0,
                            width: '380px',
                            height: '100vh',
                            background: 'var(--color-bg-primary)',
                            borderLeft: '1px solid var(--color-bg-tertiary)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 100
                        }}
                    >
                        {/* 預覽標題 */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--color-bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Smartphone style={{ width: 18, height: 18, color: 'var(--color-primary)' }} />
                                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    即時預覽
                                </span>
                            </div>
                            <motion.button
                                onClick={handleOpenPreview}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    background: 'var(--color-bg-tertiary)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <ExternalLink style={{ width: 14, height: 14 }} />
                                新分頁
                            </motion.button>
                        </div>

                        {/* 手機框架預覽 */}
                        <div style={{
                            flex: 1,
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            overflow: 'auto'
                        }}>
                            <div style={{
                                width: '320px',
                                minHeight: '568px',
                                background: 'var(--color-bg-primary)',
                                borderRadius: '32px',
                                border: '8px solid var(--color-bg-tertiary)',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                            }}>
                                {/* 手機狀態列 */}
                                <div style={{
                                    height: '28px',
                                    background: 'var(--color-bg-secondary)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '20px',
                                        background: 'var(--color-bg-primary)',
                                        borderRadius: '10px'
                                    }} />
                                </div>

                                {/* 預覽內容 */}
                                <div style={{
                                    padding: '16px 12px',
                                    overflow: 'auto',
                                    maxHeight: 'calc(568px - 28px)'
                                }}>
                                    <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                                        <Header profile={profile} />
                                        <SocialLinks socials={profile.socials} />
                                        <QuickLinks links={profile.links} />
                                        <ContactInfo contact={profile.contact} />
                                        <Footer />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPage;
