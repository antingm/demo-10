/**
 * ==========================================
 * ThemeEditor - 主題設定編輯器
 * ==========================================
 * 
 * 功能說明：
 * - 選擇預設主題模板
 * - 自訂主色調
 * - 即時預覽效果
 * 
 * 使用方式：
 * <ThemeEditor />
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Palette } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

// 預設主題模板
const themeTemplates = [
    { id: 'modern', name: '現代風格', primary: '#10B981', accent: '#D4AF37' },
    { id: 'ocean', name: '海洋藍', primary: '#3B82F6', accent: '#06B6D4' },
    { id: 'sunset', name: '夕陽橘', primary: '#F97316', accent: '#EC4899' },
    { id: 'forest', name: '森林綠', primary: '#22C55E', accent: '#84CC16' },
    { id: 'royal', name: '皇家紫', primary: '#8B5CF6', accent: '#EC4899' },
    { id: 'midnight', name: '午夜黑', primary: '#6366F1', accent: '#A855F7' },
];

// 預設顏色選項
const colorOptions = [
    '#10B981', '#3B82F6', '#F97316', '#22C55E', '#8B5CF6', '#6366F1',
    '#EC4899', '#EF4444', '#F59E0B', '#06B6D4', '#84CC16', '#A855F7'
];

const ThemeEditor = () => {
    const { profile, updateProfile } = useProfile();

    const [theme, setTheme] = useState({
        primaryColor: '#10B981',
        accentColor: '#D4AF37',
        template: 'modern'
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 同步資料
    useEffect(() => {
        if (profile?.theme) {
            setTheme(profile.theme);
        }
    }, [profile]);

    /**
     * 選擇預設模板
     */
    const handleSelectTemplate = (template) => {
        setTheme({
            template: template.id,
            primaryColor: template.primary,
            accentColor: template.accent
        });
    };

    /**
     * 更新自訂顏色
     */
    const handleColorChange = (field, value) => {
        setTheme(prev => ({
            ...prev,
            [field]: value,
            template: 'custom' // 自訂顏色時切換為 custom
        }));
    };

    /**
     * 儲存變更
     */
    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile({ theme });
            setMessage({ type: 'success', text: '主題設定已儲存！' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('儲存主題失敗：', error);
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

            {/* 預設模板選擇 */}
            <div className="admin-card">
                <h2 className="admin-card__title">選擇主題風格</h2>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '24px'
                }}>
                    選擇一個預設主題，或自訂您喜歡的顏色。
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '12px'
                }}>
                    {themeTemplates.map((template) => (
                        <motion.button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '16px',
                                borderRadius: '12px',
                                border: theme.template === template.id
                                    ? `2px solid ${template.primary}`
                                    : '2px solid transparent',
                                background: 'var(--color-bg-tertiary)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            {/* 顏色預覽 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: template.primary,
                                    boxShadow: `0 0 12px ${template.primary}50`
                                }} />
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: template.accent
                                }} />
                            </div>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: theme.template === template.id
                                    ? template.primary
                                    : 'var(--color-text-primary)'
                            }}>
                                {template.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* 自訂顏色 */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
                <h2 className="admin-card__title">自訂顏色</h2>

                {/* 主色調 */}
                <div className="admin-field">
                    <label className="admin-label">主色調</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {colorOptions.map((color) => (
                            <motion.button
                                key={color}
                                onClick={() => handleColorChange('primaryColor', color)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: color,
                                    border: theme.primaryColor === color
                                        ? '3px solid white'
                                        : '3px solid transparent',
                                    cursor: 'pointer',
                                    boxShadow: theme.primaryColor === color
                                        ? `0 0 12px ${color}`
                                        : 'none'
                                }}
                            />
                        ))}
                        {/* 自訂顏色輸入 */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="color"
                                value={theme.primaryColor}
                                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: 'transparent'
                                }}
                            />
                            <Palette style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '18px',
                                height: '18px',
                                color: 'var(--color-text-muted)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                    </div>
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        marginTop: '8px',
                        display: 'block'
                    }}>
                        目前選擇：{theme.primaryColor}
                    </span>
                </div>

                {/* 強調色 */}
                <div className="admin-field">
                    <label className="admin-label">強調色</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {colorOptions.map((color) => (
                            <motion.button
                                key={color}
                                onClick={() => handleColorChange('accentColor', color)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: color,
                                    border: theme.accentColor === color
                                        ? '3px solid white'
                                        : '3px solid transparent',
                                    cursor: 'pointer',
                                    boxShadow: theme.accentColor === color
                                        ? `0 0 12px ${color}`
                                        : 'none'
                                }}
                            />
                        ))}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="color"
                                value={theme.accentColor}
                                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: 'transparent'
                                }}
                            />
                            <Palette style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '18px',
                                height: '18px',
                                color: 'var(--color-text-muted)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                    </div>
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        marginTop: '8px',
                        display: 'block'
                    }}>
                        目前選擇：{theme.accentColor}
                    </span>
                </div>

                {/* 預覽區 */}
                <div style={{
                    marginTop: '24px',
                    padding: '24px',
                    borderRadius: '12px',
                    background: 'var(--color-bg-primary)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        顏色預覽
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: theme.primaryColor,
                                boxShadow: `0 0 20px ${theme.primaryColor}50`,
                                margin: '0 auto 8px'
                            }} />
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>主色調</span>
                        </div>
                        <div>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: theme.accentColor,
                                margin: '0 auto 8px'
                            }} />
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>強調色</span>
                        </div>
                    </div>
                </div>

                {/* 儲存按鈕 */}
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="admin-button admin-button--primary"
                    style={{ marginTop: '24px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Save style={{ width: 18, height: 18 }} />
                    {saving ? '儲存中...' : '儲存主題設定'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ThemeEditor;
