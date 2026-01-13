/**
 * ==========================================
 * BioLinkPage - 前台展示頁面（溫暖電商版）
 * ==========================================
 * 
 * 功能說明：
 * - 整合所有前台展示元件
 * - 從 Context 讀取資料
 * - 溫暖質感設計
 * 
 * 路由：/
 */

import { useProfile } from '../context/ProfileContext';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SocialLinks from '../components/SocialLinks';
import ProductSection from '../components/ProductSection';
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

    // 頁面進場動畫
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    return (
        <div className="bio-link-page">
            <motion.div
                className="bio-link-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 頭像與簡介 */}
                <motion.div variants={itemVariants}>
                    <Header profile={profile} />
                </motion.div>

                {/* 社群連結 */}
                <motion.div variants={itemVariants}>
                    <SocialLinks socials={profile.socials} />
                </motion.div>

                {/* 商品展示區（新增） */}
                {profile.products && profile.products.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <ProductSection
                            products={profile.products}
                            title="精選商品"
                            icon="✨"
                            layout="grid"
                        />
                    </motion.div>
                )}

                {/* 快速連結 */}
                <motion.div variants={itemVariants}>
                    <QuickLinks links={profile.links} />
                </motion.div>

                {/* 聯絡資訊 */}
                <motion.div variants={itemVariants}>
                    <ContactInfo contact={profile.contact} />
                </motion.div>

                {/* 頁尾 */}
                <motion.div variants={itemVariants}>
                    <Footer />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BioLinkPage;
