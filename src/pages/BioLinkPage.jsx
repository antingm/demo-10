/**
 * ==========================================
 * BioLinkPage - 前台 Bio-Link 展示頁面
 * ==========================================
 * 
 * 功能說明：
 * - 整合所有前台元件
 * - 顯示個人名片完整頁面
 * - 從 ProfileContext 取得資料
 * 
 * 路由：/
 */

import { useProfile } from '../context/ProfileContext';
import Header from '../components/Header';
import SocialLinks from '../components/SocialLinks';
import QuickLinks from '../components/QuickLinks';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';

const BioLinkPage = () => {
    const { profile, loading } = useProfile();

    // 載入中狀態
    if (loading) {
        return (
            <div className="bio-link-page">
                <div className="loading">
                    <div className="loading__spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="bio-link-page">
            <div className="bio-link-container">
                {/* 頭像與簡介 */}
                <Header profile={profile} />

                {/* 社群連結 */}
                <SocialLinks socials={profile.socials} />

                {/* 快速連結卡片 */}
                <QuickLinks links={profile.links} />

                {/* 聯絡資訊 */}
                <ContactInfo contact={profile.contact} />

                {/* 頁尾 */}
                <Footer />
            </div>
        </div>
    );
};

export default BioLinkPage;
