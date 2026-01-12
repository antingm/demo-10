/**
 * ==========================================
 * QuickLinks 元件 - 快速連結卡片區
 * ==========================================
 * 
 * 功能說明：
 * - 顯示牌卡式大按鈕連結
 * - 包含圖示、標題、描述
 * - Hover 時有滑動效果
 * 
 * 使用方式：
 * <QuickLinks links={linksArray} />
 */

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const QuickLinks = ({ links = [] }) => {
    // 篩選已啟用的連結，並依 order 排序
    const activeLinks = links
        .filter(link => link.enabled)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    // 如果沒有連結，不渲染
    if (activeLinks.length === 0) return null;

    // 容器動畫設定
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
            }
        }
    };

    // 單一卡片動畫設定
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    /**
     * 處理連結點擊
     * @param {string} url - 目標 URL
     */
    const handleClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.section
            className="quick-links"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="快速連結"
        >
            {activeLinks.map((link) => (
                <motion.button
                    key={link.id}
                    className="quick-link-card"
                    variants={itemVariants}
                    whileHover={{
                        x: 4,
                        transition: { type: 'spring', stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClick(link.url)}
                    aria-label={link.title}
                >
                    {/* 圖示 */}
                    <span className="quick-link-card__icon" role="img" aria-hidden="true">
                        {link.icon}
                    </span>

                    {/* 內容 */}
                    <div className="quick-link-card__content">
                        <h3 className="quick-link-card__title">{link.title}</h3>
                        {link.description && (
                            <p className="quick-link-card__description">{link.description}</p>
                        )}
                    </div>

                    {/* 箭頭 */}
                    <ChevronRight className="quick-link-card__arrow" />
                </motion.button>
            ))}
        </motion.section>
    );
};

export default QuickLinks;
