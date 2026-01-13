/**
 * ==========================================
 * QRCodeGenerator - QR Code 生成器
 * ==========================================
 * 
 * 功能說明：
 * - 自動生成個人頁面 QR Code
 * - 支援下載 PNG 格式
 * - 可自訂 QR Code 顏色
 * 
 * 使用方式：
 * <QRCodeGenerator />
 */

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import {
    Download,
    Copy,
    Check,
    QrCode,
    ExternalLink,
    Palette
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

// 預設顏色選項
const colorOptions = [
    { value: '#000000', label: '經典黑' },
    { value: '#10B981', label: '翡翠綠' },
    { value: '#3B82F6', label: '天空藍' },
    { value: '#8B5CF6', label: '夢幻紫' },
    { value: '#EC4899', label: '玫瑰粉' },
    { value: '#F59E0B', label: '暖陽橙' },
    { value: '#EF4444', label: '熱情紅' },
];

const QRCodeGenerator = () => {
    const { profile } = useProfile();
    const qrRef = useRef(null);

    const [qrColor, setQrColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [copied, setCopied] = useState(false);
    const [qrSize, setQrSize] = useState(200);

    // 取得當前網站網址
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    const pageUrl = currentUrl; // 首頁即為 Bio-Link 頁面

    /**
     * 下載 QR Code PNG
     */
    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${profile?.name || 'bio-link'}-qrcode.png`;
        link.href = url;
        link.click();
    };

    /**
     * 複製網址
     */
    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('複製失敗：', error);
        }
    };

    /**
     * 開啟新分頁預覽
     */
    const handleOpenUrl = () => {
        window.open(pageUrl, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="admin-card">
                <h2 className="admin-card__title">QR Code 生成</h2>

                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {/* 左側：QR Code 預覽 */}
                    <div style={{ flex: '0 0 auto' }}>
                        <div
                            ref={qrRef}
                            style={{
                                background: bgColor,
                                padding: '24px',
                                borderRadius: '16px',
                                display: 'inline-block',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}
                        >
                            <QRCodeCanvas
                                value={pageUrl}
                                size={qrSize}
                                level="H"
                                fgColor={qrColor}
                                bgColor={bgColor}
                                includeMargin={false}
                            />
                        </div>

                        {/* 下載按鈕 */}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <motion.button
                                onClick={handleDownload}
                                className="admin-button admin-button--primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ flex: 1 }}
                            >
                                <Download style={{ width: 18, height: 18 }} />
                                下載 PNG
                            </motion.button>
                        </div>
                    </div>

                    {/* 右側：設定面板 */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        {/* 網址顯示 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                marginBottom: '8px'
                            }}>
                                您的 Bio-Link 網址
                            </label>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center'
                            }}>
                                <input
                                    type="text"
                                    value={pageUrl}
                                    readOnly
                                    className="admin-input"
                                    style={{
                                        flex: 1,
                                        padding: '10px 12px',
                                        fontSize: '14px'
                                    }}
                                />
                                <motion.button
                                    onClick={handleCopyUrl}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: copied ? 'var(--color-success)' : 'var(--color-bg-tertiary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {copied ? (
                                        <Check style={{ width: 18, height: 18, color: 'white' }} />
                                    ) : (
                                        <Copy style={{ width: 18, height: 18, color: 'var(--color-text-secondary)' }} />
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={handleOpenUrl}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--color-bg-tertiary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ExternalLink style={{ width: 18, height: 18, color: 'var(--color-text-secondary)' }} />
                                </motion.button>
                            </div>
                        </div>

                        {/* QR Code 顏色 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                marginBottom: '8px'
                            }}>
                                <Palette style={{ width: 14, height: 14, display: 'inline', marginRight: '6px' }} />
                                QR Code 顏色
                            </label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {colorOptions.map(color => (
                                    <motion.button
                                        key={color.value}
                                        onClick={() => setQrColor(color.value)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: color.value,
                                            border: qrColor === color.value
                                                ? '3px solid var(--color-primary)'
                                                : '2px solid var(--color-bg-tertiary)',
                                            cursor: 'pointer',
                                            boxShadow: qrColor === color.value
                                                ? '0 0 0 2px var(--color-bg-primary)'
                                                : 'none'
                                        }}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* QR Code 大小 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)',
                                marginBottom: '8px'
                            }}>
                                <QrCode style={{ width: 14, height: 14, display: 'inline', marginRight: '6px' }} />
                                QR Code 大小：{qrSize}px
                            </label>
                            <input
                                type="range"
                                min="150"
                                max="350"
                                value={qrSize}
                                onChange={(e) => setQrSize(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    accentColor: 'var(--color-primary)'
                                }}
                            />
                        </div>

                        {/* 使用說明 */}
                        <div style={{
                            padding: '16px',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.6
                        }}>
                            <strong style={{ color: 'var(--color-text-primary)' }}>💡 使用提示</strong>
                            <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px' }}>
                                <li>下載 QR Code 列印在名片上</li>
                                <li>分享給客戶快速掃描</li>
                                <li>放在社群媒體簡介中</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QRCodeGenerator;
