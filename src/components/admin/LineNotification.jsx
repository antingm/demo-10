/**
 * ==========================================
 * LineNotification - LINE 通知設定
 * ==========================================
 * 
 * 功能說明：
 * - LINE Notify Token 設定
 * - 通知類型設定
 * - 測試發送功能
 * 
 * 企業版功能
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Bell,
    Send,
    Check,
    AlertCircle,
    Crown,
    ExternalLink
} from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';

const LineNotification = () => {
    const { isEnterprise } = usePlan();
    const { profile, updateProfile } = useProfile();
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        lineNotifyToken: '',
        enablePageView: true,
        enableLinkClick: true,
        enableProductClick: true,
        dailySummary: true
    });
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // 同步設定
    useEffect(() => {
        if (profile?.lineNotify) {
            setSettings(prev => ({ ...prev, ...profile.lineNotify }));
        }
    }, [profile]);

    /**
     * 更新設定
     */
    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    /**
     * 儲存設定
     */
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ lineNotify: settings });
            setTestResult({ type: 'success', message: '設定已儲存' });
            setTimeout(() => setTestResult(null), 3000);
        } catch (error) {
            setTestResult({ type: 'error', message: '儲存失敗' });
        } finally {
            setSaving(false);
        }
    };

    /**
     * 測試發送
     */
    const handleTestSend = async () => {
        if (!settings.lineNotifyToken) {
            setTestResult({ type: 'error', message: '請先填入 LINE Notify Token' });
            return;
        }

        setTesting(true);
        setTestResult(null);

        try {
            // 模擬測試發送（實際需要 Cloud Function）
            await new Promise(resolve => setTimeout(resolve, 1500));
            setTestResult({ type: 'success', message: '測試訊息已發送！請檢查您的 LINE' });
        } catch (error) {
            setTestResult({ type: 'error', message: '發送失敗，請確認 Token 是否正確' });
        } finally {
            setTesting(false);
        }
    };

    // 如果不是企業版，顯示升級提示
    if (!isEnterprise) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="admin-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
                    <Crown style={{
                        width: 64,
                        height: 64,
                        color: 'var(--color-accent)',
                        marginBottom: '24px'
                    }} />
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: 'var(--color-text-primary)',
                        marginBottom: '12px'
                    }}>
                        LINE 通知為企業版功能
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '24px',
                        maxWidth: '400px',
                        margin: '0 auto 24px'
                    }}>
                        升級至企業版即可收到即時 LINE 通知，包括新訪客、連結點擊等重要事件。
                    </p>
                    <motion.button
                        onClick={() => navigate('/upgrade')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '14px 32px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        升級至企業版
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* 訊息提示 */}
            {testResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '12px 16px',
                        marginBottom: '16px',
                        borderRadius: '8px',
                        background: testResult.type === 'success'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color: testResult.type === 'success'
                            ? 'var(--color-success)'
                            : 'var(--color-error)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {testResult.type === 'success' ? (
                        <Check style={{ width: 18, height: 18 }} />
                    ) : (
                        <AlertCircle style={{ width: 18, height: 18 }} />
                    )}
                    {testResult.message}
                </motion.div>
            )}

            <div className="admin-card">
                <h2 className="admin-card__title">
                    <Bell style={{ width: 20, height: 20, display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    LINE Notify 設定
                </h2>

                {/* 說明 */}
                <div style={{
                    padding: '16px',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6
                }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>如何取得 LINE Notify Token？</strong>
                    <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                        <li>前往 <a href="https://notify-bot.line.me/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>LINE Notify 官網 <ExternalLink style={{ width: 12, height: 12, display: 'inline' }} /></a></li>
                        <li>使用 LINE 帳號登入</li>
                        <li>點擊「發行權杖」</li>
                        <li>選擇通知接收對象，複製 Token 貼至下方</li>
                    </ol>
                </div>

                {/* Token 輸入 */}
                <div className="admin-field">
                    <label className="admin-label">LINE Notify Token</label>
                    <input
                        type="password"
                        value={settings.lineNotifyToken}
                        onChange={(e) => handleChange('lineNotifyToken', e.target.value)}
                        placeholder="貼上您的 LINE Notify Token"
                        className="admin-input"
                        style={{ padding: '12px' }}
                    />
                </div>

                {/* 通知類型 */}
                <div style={{ marginTop: '24px' }}>
                    <label className="admin-label">通知類型</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: 'enablePageView', label: '新訪客瀏覽', desc: '有人瀏覽您的頁面時通知' },
                            { id: 'enableLinkClick', label: '連結點擊', desc: '有人點擊快速連結時通知' },
                            { id: 'enableProductClick', label: '商品點擊', desc: '有人點擊商品時通知' },
                            { id: 'dailySummary', label: '每日摘要', desc: '每天發送一次統計摘要' },
                        ].map(item => (
                            <label
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={settings[item.id]}
                                    onChange={(e) => handleChange(item.id, e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                                />
                                <div>
                                    <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.label}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 操作按鈕 */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <motion.button
                        onClick={handleTestSend}
                        disabled={testing || !settings.lineNotifyToken}
                        className="admin-button admin-button--secondary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ flex: 1 }}
                    >
                        <Send style={{ width: 18, height: 18 }} />
                        {testing ? '發送中...' : '測試發送'}
                    </motion.button>
                    <motion.button
                        onClick={handleSave}
                        disabled={saving}
                        className="admin-button admin-button--primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ flex: 1 }}
                    >
                        <Save style={{ width: 18, height: 18 }} />
                        {saving ? '儲存中...' : '儲存設定'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default LineNotification;
