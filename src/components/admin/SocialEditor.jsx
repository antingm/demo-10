/**
 * ==========================================
 * SocialEditor - 社群連結編輯器
 * ==========================================
 * 
 * 功能說明：
 * - 編輯各社群平台連結
 * - 啟用/停用切換
 * 
 * 使用方式：
 * <SocialEditor />
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

// 社群平台設定
const socialPlatforms = [
    { id: 'line', name: 'LINE', placeholder: 'https://line.me/ti/p/~yourlineid' },
    { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/yourusername' },
    { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/c/yourchannel' },
    { id: 'twitter', name: 'Twitter / X', placeholder: 'https://twitter.com/yourusername' },
    { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile' },
    { id: 'website', name: '個人網站', placeholder: 'https://yourwebsite.com' },
];

const SocialEditor = () => {
    const { profile, updateSocials } = useProfile();

    const [socials, setSocials] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 初始化社群連結資料
    useEffect(() => {
        if (profile?.socials) {
            // 合併既有資料與預設平台
            const merged = socialPlatforms.map(platform => {
                const existing = profile.socials.find(s => s.platform === platform.id);
                return {
                    platform: platform.id,
                    url: existing?.url || '',
                    enabled: existing?.enabled ?? false
                };
            });
            setSocials(merged);
        } else {
            // 使用預設資料
            setSocials(socialPlatforms.map(p => ({
                platform: p.id,
                url: '',
                enabled: false
            })));
        }
    }, [profile]);

    /**
     * 更新社群連結
     */
    const handleChange = (platformId, field, value) => {
        setSocials(socials.map(social =>
            social.platform === platformId
                ? { ...social, [field]: value }
                : social
        ));
    };

    /**
     * 儲存變更
     */
    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // 只儲存有 URL 或已啟用的社群連結
            const filteredSocials = socials.filter(s => s.url || s.enabled);
            await updateSocials(filteredSocials);
            setMessage({ type: 'success', text: '儲存成功！' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('儲存社群連結失敗：', error);
            setMessage({ type: 'error', text: '儲存失敗，請稍後再試' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* 訊息提示 */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '12px 16px',
                        marginBottom: '16px',
                        borderRadius: '8px',
                        background: message.type === 'success'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color: message.type === 'success'
                            ? 'var(--color-success)'
                            : 'var(--color-error)',
                        fontSize: '14px'
                    }}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="admin-card">
                <h2 className="admin-card__title">社群連結管理</h2>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '24px'
                }}>
                    輸入您的社群連結，開啟「顯示」開關後會在名片頁面上顯示對應圖示。
                </p>

                {/* 社群平台列表 */}
                {socialPlatforms.map((platform) => {
                    const social = socials.find(s => s.platform === platform.id) || {
                        platform: platform.id,
                        url: '',
                        enabled: false
                    };

                    return (
                        <div
                            key={platform.id}
                            className="admin-field"
                            style={{
                                padding: '16px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '8px',
                                marginBottom: '12px'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <label className="admin-label" style={{ margin: 0, fontWeight: 600 }}>
                                    {platform.name}
                                </label>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{
                                        fontSize: '12px',
                                        color: social.enabled ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                    }}>
                                        {social.enabled ? '已顯示' : '已隱藏'}
                                    </span>
                                    <div
                                        onClick={() => handleChange(platform.id, 'enabled', !social.enabled)}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            background: social.enabled ? 'var(--color-primary)' : 'var(--color-bg-hover)',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            position: 'absolute',
                                            top: '2px',
                                            left: social.enabled ? '22px' : '2px',
                                            transition: 'left 0.2s',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }} />
                                    </div>
                                </label>
                            </div>
                            <input
                                type="url"
                                value={social.url}
                                onChange={(e) => handleChange(platform.id, 'url', e.target.value)}
                                className="admin-input"
                                placeholder={platform.placeholder}
                            />
                        </div>
                    );
                })}

                {/* 儲存按鈕 */}
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="admin-button admin-button--primary"
                    style={{ marginTop: '16px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Save style={{ width: 18, height: 18 }} />
                    {saving ? '儲存中...' : '儲存變更'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SocialEditor;
