/**
 * ==========================================
 * Footer 元件 - 頁尾
 * ==========================================
 * 
 * 功能說明：
 * - 顯示 Powered by Anting Studio
 * - 顯示版權宣告
 * 
 * 使用方式：
 * <Footer />
 */

import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            className="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
        >
            <p className="footer__powered">
                Powered by{' '}
                <a
                    href="https://anting-studio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Anting Studio
                </a>
            </p>
            <p className="footer__powered" style={{ marginTop: '4px' }}>
                © {currentYear} All rights reserved.
            </p>
        </motion.footer>
    );
};

export default Footer;
