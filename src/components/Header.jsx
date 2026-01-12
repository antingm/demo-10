/**
 * ==========================================
 * Header 元件 - 個人頭像與簡介區
 * ==========================================
 * 
 * 功能說明：
 * - 顯示圓形頭像（帶光暈效果）
 * - 顯示姓名、職稱、個人簡介
 * - 支援淡入動畫
 * 
 * 使用方式：
 * <Header profile={profileData} />
 */

import { motion } from 'framer-motion';

const Header = ({ profile }) => {
    // 動畫設定：淡入並上移
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.header
            className="header"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 頭像容器 - 帶光暈效果 */}
            <motion.div
                className="header__avatar-wrapper"
                variants={itemVariants}
            >
                {/* 光暈效果 */}
                <div className="header__avatar-glow" />

                {/* 頭像圖片 */}
                <img
                    src={profile.avatarUrl || 'https://via.placeholder.com/120?text=Avatar'}
                    alt={profile.name}
                    className="header__avatar"
                />
            </motion.div>

            {/* 姓名 */}
            <motion.h1
                className="header__name"
                variants={itemVariants}
            >
                {profile.name}
            </motion.h1>

            {/* 職稱 */}
            <motion.p
                className="header__title"
                variants={itemVariants}
            >
                {profile.title}
            </motion.p>

            {/* 個人簡介 */}
            {profile.bio && (
                <motion.p
                    className="header__bio"
                    variants={itemVariants}
                >
                    {profile.bio}
                </motion.p>
            )}
        </motion.header>
    );
};

export default Header;
