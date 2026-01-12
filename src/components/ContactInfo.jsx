/**
 * ==========================================
 * ContactInfo 元件 - 聯絡資訊區
 * ==========================================
 * 
 * 功能說明：
 * - 顯示電話、Email、地址
 * - 支援一鍵撥打、一鍵發信、一鍵導航
 * 
 * 使用方式：
 * <ContactInfo contact={contactData} />
 */

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactInfo = ({ contact = {} }) => {
    // 檢查是否有任何聯絡資訊要顯示
    const hasPhone = contact.showPhone && contact.phone;
    const hasEmail = contact.showEmail && contact.email;
    const hasAddress = contact.showAddress && contact.address;

    // 如果沒有任何聯絡資訊，不渲染
    if (!hasPhone && !hasEmail && !hasAddress) return null;

    // 容器動畫設定
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    // 單一項目動畫設定
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    /**
     * 處理電話點擊 - 撥打電話
     */
    const handlePhoneClick = () => {
        window.location.href = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`;
    };

    /**
     * 處理 Email 點擊 - 開啟郵件客戶端
     */
    const handleEmailClick = () => {
        window.location.href = `mailto:${contact.email}`;
    };

    /**
     * 處理地址點擊 - 開啟 Google Maps
     */
    const handleAddressClick = () => {
        const encodedAddress = encodeURIComponent(contact.address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    return (
        <motion.section
            className="contact-info"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="聯絡資訊"
        >
            {/* 電話 */}
            {hasPhone && (
                <motion.button
                    className="contact-item"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    onClick={handlePhoneClick}
                    aria-label={`撥打電話 ${contact.phone}`}
                >
                    <Phone />
                    <span>{contact.phone}</span>
                </motion.button>
            )}

            {/* Email */}
            {hasEmail && (
                <motion.button
                    className="contact-item"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    onClick={handleEmailClick}
                    aria-label={`發送郵件至 ${contact.email}`}
                >
                    <Mail />
                    <span>{contact.email}</span>
                </motion.button>
            )}

            {/* 地址 */}
            {hasAddress && (
                <motion.button
                    className="contact-item"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    onClick={handleAddressClick}
                    aria-label={`在地圖上查看 ${contact.address}`}
                >
                    <MapPin />
                    <span>{contact.address}</span>
                </motion.button>
            )}
        </motion.section>
    );
};

export default ContactInfo;
