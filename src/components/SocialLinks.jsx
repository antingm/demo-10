/**
 * ==========================================
 * SocialLinks 元件 - 社群連結按鈕組
 * ==========================================
 * 
 * 功能說明：
 * - 顯示各社群平台圖示按鈕
 * - Hover 時有彈跳動畫
 * - 支援 LINE、Instagram、Facebook、YouTube 等
 * 
 * 使用方式：
 * <SocialLinks socials={socialsArray} />
 */

import { motion } from 'framer-motion';
import {
    MessageCircle,  // LINE
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    Linkedin,
    Globe,
    Mail
} from 'lucide-react';

// 社群平台圖示對應表
const platformIcons = {
    line: MessageCircle,
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    twitter: Twitter,
    linkedin: Linkedin,
    website: Globe,
    email: Mail
};

// 社群平台名稱對應表（用於 alt text）
const platformNames = {
    line: 'LINE',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    website: '網站',
    email: 'Email'
};

const SocialLinks = ({ socials = [] }) => {
    // 篩選已啟用且有 URL 的社群連結
    const activeSocials = socials.filter(s => s.enabled && s.url);

    // 如果沒有任何社群連結，不渲染
    if (activeSocials.length === 0) return null;

    // 容器動畫設定
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
            }
        }
    };

    // 單一按鈕動畫設定
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.nav
            className="social-links"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="社群連結"
        >
            {activeSocials.map((social, index) => {
                const Icon = platformIcons[social.platform] || Globe;
                const name = platformNames[social.platform] || '連結';

                return (
                    <motion.a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.15,
                            y: -4,
                            transition: { type: 'spring', stiffness: 400 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        title={name}
                        aria-label={`前往 ${name}`}
                    >
                        <Icon />
                    </motion.a>
                );
            })}
        </motion.nav>
    );
};

export default SocialLinks;
