/**
 * ==========================================
 * ProfileEditor - 個人資料編輯器
 * ==========================================
 * 
 * 功能說明：
 * - 編輯姓名、職稱、簡介
 * - 上傳/更換頭像
 * - 即時儲存至 Firestore
 * 
 * 使用方式：
 * <ProfileEditor />
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Camera } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const ProfileEditor = () => {
    const { profile, loading, updateProfile } = useProfile();
    const { user } = useAuth();

    // 本地表單狀態
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 同步 profile 資料至表單
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                title: profile.title || '',
                bio: profile.bio || '',
            });
        }
    }, [profile]);

    /**
     * 處理輸入變更
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * 儲存變更
     */
    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(formData);
            setMessage({ type: 'success', text: '儲存成功！' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('儲存失敗：', error);
            setMessage({ type: 'error', text: '儲存失敗，請稍後再試' });
        } finally {
            setSaving(false);
        }
    };

    /**
     * 處理頭像上傳
     */
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 驗證檔案類型
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: '請上傳圖片檔案' });
            return;
        }

        // 驗證檔案大小（限制 2MB）
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: '圖片大小不可超過 2MB' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            // 建立儲存路徑
            const fileName = `avatar_${Date.now()}.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, `avatars/${user.uid}/${fileName}`);

            // 上傳圖片
            await uploadBytes(storageRef, file);

            // 取得下載 URL
            const downloadURL = await getDownloadURL(storageRef);

            // 更新 profile
            await updateProfile({ avatarUrl: downloadURL });

            setMessage({ type: 'success', text: '頭像更新成功！' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('頭像上傳失敗：', error);
            setMessage({ type: 'error', text: '上傳失敗，請稍後再試' });
        } finally {
            setUploading(false);
        }
    };

    // 載入中狀態
    if (loading) {
        return (
            <div className="admin-card">
                <div className="loading">
                    <div className="loading__spinner" />
                </div>
            </div>
        );
    }

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
                <h2 className="admin-card__title">基本資料</h2>

                {/* 頭像上傳 */}
                <div className="admin-field">
                    <label className="admin-label">頭像</label>
                    <div className="image-uploader">
                        <label className="image-uploader__preview" style={{ cursor: 'pointer' }}>
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="頭像預覽" />
                            ) : (
                                <Camera style={{ width: 40, height: 40, color: 'var(--color-text-muted)' }} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="image-uploader__input"
                                disabled={uploading}
                            />
                        </label>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {uploading ? '上傳中...' : '點擊上傳頭像（建議 300x300，最大 2MB）'}
                        </span>
                    </div>
                </div>

                {/* 姓名輸入 */}
                <div className="admin-field">
                    <label className="admin-label">姓名</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="請輸入您的姓名"
                    />
                </div>

                {/* 職稱輸入 */}
                <div className="admin-field">
                    <label className="admin-label">職稱</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="例如：專業攝影師 | 品牌顧問"
                    />
                </div>

                {/* 個人簡介 */}
                <div className="admin-field">
                    <label className="admin-label">個人簡介</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="admin-textarea"
                        placeholder="用一句話介紹自己..."
                        rows={3}
                    />
                </div>

                {/* 儲存按鈕 */}
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="admin-button admin-button--primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Save style={{ width: 18, height: 18 }} />
                    {saving ? '儲存中...' : '儲存變更'}
                </motion.button>
            </div>

            {/* 聯絡資訊編輯區 */}
            <ContactEditor />
        </motion.div>
    );
};

/**
 * ContactEditor - 聯絡資訊編輯器（內嵌元件）
 */
const ContactEditor = () => {
    const { profile, updateProfile } = useProfile();

    const [contact, setContact] = useState({
        phone: '',
        email: '',
        address: '',
        showPhone: true,
        showEmail: true,
        showAddress: false
    });
    const [saving, setSaving] = useState(false);

    // 同步資料
    useEffect(() => {
        if (profile?.contact) {
            setContact(profile.contact);
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setContact(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ contact });
        } catch (error) {
            console.error('儲存聯絡資訊失敗：', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-card" style={{ marginTop: '24px' }}>
            <h2 className="admin-card__title">聯絡資訊</h2>

            {/* 電話 */}
            <div className="admin-field">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>電話</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        <input
                            type="checkbox"
                            name="showPhone"
                            checked={contact.showPhone}
                            onChange={handleChange}
                        />
                        顯示
                    </label>
                </div>
                <input
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="0912-345-678"
                />
            </div>

            {/* Email */}
            <div className="admin-field">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Email</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        <input
                            type="checkbox"
                            name="showEmail"
                            checked={contact.showEmail}
                            onChange={handleChange}
                        />
                        顯示
                    </label>
                </div>
                <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="hello@example.com"
                />
            </div>

            {/* 地址 */}
            <div className="admin-field">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>地址</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        <input
                            type="checkbox"
                            name="showAddress"
                            checked={contact.showAddress}
                            onChange={handleChange}
                        />
                        顯示
                    </label>
                </div>
                <input
                    type="text"
                    name="address"
                    value={contact.address}
                    onChange={handleChange}
                    className="admin-input"
                    placeholder="台北市信義區信義路五段7號"
                />
            </div>

            {/* 儲存按鈕 */}
            <motion.button
                onClick={handleSave}
                disabled={saving}
                className="admin-button admin-button--primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Save style={{ width: 18, height: 18 }} />
                {saving ? '儲存中...' : '儲存變更'}
            </motion.button>
        </div>
    );
};

export default ProfileEditor;
