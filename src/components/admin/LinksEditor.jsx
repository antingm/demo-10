/**
 * ==========================================
 * LinksEditor - 快速連結編輯器
 * ==========================================
 * 
 * 功能說明：
 * - 新增/編輯/刪除快速連結
 * - 拖拉排序功能
 * - 啟用/停用切換
 * 
 * 使用方式：
 * <LinksEditor />
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Save,
    Trash2,
    GripVertical,
    Edit2,
    X,
    Check
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

// 預設表情符號選項
const emojiOptions = ['📞', '🛒', '📍', '💼', '📷', '🎬', '🎵', '📝', '💬', '🔗', '⭐', '❤️'];

const LinksEditor = () => {
    const { profile, updateLinks } = useProfile();

    const [links, setLinks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    // 同步資料
    useEffect(() => {
        if (profile?.links) {
            setLinks([...profile.links].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
    }, [profile]);

    /**
     * 新增連結
     */
    const handleAdd = () => {
        const newLink = {
            id: `link-${Date.now()}`,
            icon: '🔗',
            title: '新連結',
            description: '',
            url: '',
            enabled: true,
            order: links.length
        };
        setLinks([...links, newLink]);
        setEditingId(newLink.id);
    };

    /**
     * 更新單一連結
     */
    const handleUpdate = (id, updates) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, ...updates } : link
        ));
    };

    /**
     * 刪除連結
     */
    const handleDelete = (id) => {
        if (confirm('確定要刪除這個連結嗎？')) {
            setLinks(links.filter(link => link.id !== id));
        }
    };

    /**
     * 切換啟用狀態
     */
    const handleToggle = (id) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, enabled: !link.enabled } : link
        ));
    };

    /**
     * 移動連結順序
     */
    const handleMove = (id, direction) => {
        const index = links.findIndex(link => link.id === id);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === links.length - 1)
        ) {
            return;
        }

        const newLinks = [...links];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

        // 更新 order
        newLinks.forEach((link, i) => {
            link.order = i;
        });

        setLinks(newLinks);
    };

    /**
     * 儲存所有變更
     */
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateLinks(links);
            setEditingId(null);
        } catch (error) {
            console.error('儲存連結失敗：', error);
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
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="admin-card__title" style={{ margin: 0, border: 'none', padding: 0 }}>快速連結管理</h2>
                    <motion.button
                        className="admin-button admin-button--secondary"
                        onClick={handleAdd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus style={{ width: 18, height: 18 }} />
                        新增連結
                    </motion.button>
                </div>

                {/* 連結列表 */}
                <AnimatePresence mode="popLayout">
                    {links.map((link, index) => (
                        <motion.div
                            key={link.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="link-item"
                            style={{
                                opacity: link.enabled ? 1 : 0.5,
                                background: editingId === link.id ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)'
                            }}
                        >
                            {/* 拖拉手柄 */}
                            <div className="link-item__drag-handle">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <button
                                        onClick={() => handleMove(link.id, 'up')}
                                        disabled={index === 0}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '2px',
                                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                                            opacity: index === 0 ? 0.3 : 1
                                        }}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => handleMove(link.id, 'down')}
                                        disabled={index === links.length - 1}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '2px',
                                            cursor: index === links.length - 1 ? 'not-allowed' : 'pointer',
                                            opacity: index === links.length - 1 ? 0.3 : 1
                                        }}
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>

                            {/* 圖示選擇 */}
                            {editingId === link.id ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', width: '100px' }}>
                                    {emojiOptions.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleUpdate(link.id, { icon: emoji })}
                                            style={{
                                                background: link.icon === emoji ? 'var(--color-primary)' : 'transparent',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '16px',
                                                padding: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <span style={{ fontSize: '24px' }}>{link.icon}</span>
                            )}

                            {/* 內容編輯 */}
                            <div className="link-item__content" style={{ flex: 1 }}>
                                {editingId === link.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={link.title}
                                            onChange={(e) => handleUpdate(link.id, { title: e.target.value })}
                                            placeholder="連結標題"
                                            className="admin-input"
                                            style={{ padding: '8px' }}
                                        />
                                        <input
                                            type="text"
                                            value={link.description}
                                            onChange={(e) => handleUpdate(link.id, { description: e.target.value })}
                                            placeholder="連結描述"
                                            className="admin-input"
                                            style={{ padding: '8px' }}
                                        />
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
                                            placeholder="https://..."
                                            className="admin-input"
                                            style={{ padding: '8px' }}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{link.title}</div>
                                        {link.description && (
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{link.description}</div>
                                        )}
                                        {link.url && (
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                {link.url.substring(0, 40)}...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 操作按鈕 */}
                            <div className="link-item__actions">
                                {editingId === link.id ? (
                                    <motion.button
                                        onClick={() => setEditingId(null)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            background: 'var(--color-success)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Check style={{ width: 16, height: 16, color: 'white' }} />
                                    </motion.button>
                                ) : (
                                    <>
                                        <motion.button
                                            onClick={() => handleToggle(link.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: link.enabled ? 'var(--color-primary)' : 'var(--color-bg-hover)',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px',
                                                cursor: 'pointer'
                                            }}
                                            title={link.enabled ? '點擊停用' : '點擊啟用'}
                                        >
                                            {link.enabled ? '✓' : '○'}
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setEditingId(link.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: 'var(--color-bg-hover)',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Edit2 style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(link.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: 'var(--color-error)',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 style={{ width: 16, height: 16, color: 'white' }} />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {links.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: 'var(--color-text-muted)'
                    }}>
                        尚無快速連結，點擊「新增連結」開始建立
                    </div>
                )}

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
                    {saving ? '儲存中...' : '儲存所有變更'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LinksEditor;
