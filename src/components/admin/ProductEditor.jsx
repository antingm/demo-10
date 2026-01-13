/**
 * ==========================================
 * ProductEditor - 商品管理編輯器
 * ==========================================
 * 
 * 功能說明：
 * - 新增/編輯/刪除商品
 * - 圖片上傳（Firebase Storage）
 * - 價格設定（原價、特價）
 * - 拖拉排序功能
 * - 啟用/停用切換
 * 
 * 使用方式：
 * <ProductEditor />
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Save,
    Trash2,
    Edit2,
    X,
    Check,
    Upload,
    Image as ImageIcon,
    ExternalLink,
    Tag
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

// 預設標籤選項
const tagOptions = [
    { value: '', label: '無標籤' },
    { value: 'hot', label: '🔥 熱銷' },
    { value: 'new', label: '✨ 新品' },
    { value: 'sale', label: '💰 特價' },
    { value: 'limited', label: '⏰ 限量' },
];

const ProductEditor = () => {
    const { profile, updateProfile } = useProfile();
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null);

    const fileInputRefs = useRef({});

    // 同步資料
    useEffect(() => {
        if (profile?.products) {
            setProducts([...profile.products].sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
    }, [profile]);

    /**
     * 新增商品
     */
    const handleAdd = () => {
        const newProduct = {
            id: `prod-${Date.now()}`,
            name: '新商品',
            description: '',
            price: 0,
            originalPrice: 0,
            image: '',
            tag: '',
            url: '',
            enabled: true,
            order: products.length
        };
        setProducts([...products, newProduct]);
        setEditingId(newProduct.id);
    };

    /**
     * 更新單一商品
     */
    const handleUpdate = (id, updates) => {
        setProducts(products.map(prod =>
            prod.id === id ? { ...prod, ...updates } : prod
        ));
    };

    /**
     * 刪除商品
     */
    const handleDelete = (id) => {
        if (confirm('確定要刪除這個商品嗎？')) {
            setProducts(products.filter(prod => prod.id !== id));
        }
    };

    /**
     * 切換啟用狀態
     */
    const handleToggle = (id) => {
        setProducts(products.map(prod =>
            prod.id === id ? { ...prod, enabled: !prod.enabled } : prod
        ));
    };

    /**
     * 移動商品順序
     */
    const handleMove = (id, direction) => {
        const index = products.findIndex(prod => prod.id === id);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === products.length - 1)
        ) {
            return;
        }

        const newProducts = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];

        // 更新 order
        newProducts.forEach((prod, i) => {
            prod.order = i;
        });

        setProducts(newProducts);
    };

    /**
     * 上傳圖片
     */
    const handleImageUpload = async (productId, file) => {
        if (!file || !user) return;

        setUploading(productId);
        try {
            const fileRef = ref(storage, `products/${user.uid}/${productId}-${Date.now()}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            handleUpdate(productId, { image: downloadURL });
        } catch (error) {
            console.error('圖片上傳失敗：', error);
            alert('圖片上傳失敗，請確認 Firebase Storage 設定');
        } finally {
            setUploading(null);
        }
    };

    /**
     * 儲存所有變更
     */
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ products });
            setEditingId(null);
        } catch (error) {
            console.error('儲存商品失敗：', error);
        } finally {
            setSaving(false);
        }
    };

    /**
     * 計算折扣百分比
     */
    const getDiscountPercent = (price, originalPrice) => {
        if (!originalPrice || originalPrice <= price) return null;
        return Math.round((1 - price / originalPrice) * 100);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="admin-card__title" style={{ margin: 0, border: 'none', padding: 0 }}>商品管理</h2>
                    <motion.button
                        className="admin-button admin-button--secondary"
                        onClick={handleAdd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus style={{ width: 18, height: 18 }} />
                        新增商品
                    </motion.button>
                </div>

                {/* 商品列表 */}
                <AnimatePresence mode="popLayout">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '16px',
                                marginBottom: '12px',
                                borderRadius: '12px',
                                opacity: product.enabled ? 1 : 0.5,
                                background: editingId === product.id ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)'
                            }}
                        >
                            {/* 排序按鈕 */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <button
                                    onClick={() => handleMove(product.id, 'up')}
                                    disabled={index === 0}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                        opacity: index === 0 ? 0.3 : 1,
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => handleMove(product.id, 'down')}
                                    disabled={index === products.length - 1}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: index === products.length - 1 ? 'not-allowed' : 'pointer',
                                        opacity: index === products.length - 1 ? 0.3 : 1,
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    ▼
                                </button>
                            </div>

                            {/* 商品圖片 */}
                            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'var(--color-bg-hover)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <ImageIcon style={{ width: 24, height: 24, color: 'var(--color-text-muted)' }} />
                                    </div>
                                )}

                                {editingId === product.id && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={el => fileInputRefs.current[product.id] = el}
                                            onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                        <motion.button
                                            onClick={() => fileInputRefs.current[product.id]?.click()}
                                            disabled={uploading === product.id}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '-8px',
                                                right: '-8px',
                                                background: 'var(--color-primary)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {uploading === product.id ? (
                                                <span style={{ color: 'white', fontSize: '12px' }}>...</span>
                                            ) : (
                                                <Upload style={{ width: 14, height: 14, color: 'white' }} />
                                            )}
                                        </motion.button>
                                    </>
                                )}
                            </div>

                            {/* 商品資訊 */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {editingId === product.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={product.name}
                                            onChange={(e) => handleUpdate(product.id, { name: e.target.value })}
                                            placeholder="商品名稱"
                                            className="admin-input"
                                            style={{ padding: '8px' }}
                                        />
                                        <input
                                            type="text"
                                            value={product.description || ''}
                                            onChange={(e) => handleUpdate(product.id, { description: e.target.value })}
                                            placeholder="商品描述（選填）"
                                            className="admin-input"
                                            style={{ padding: '8px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>售價</label>
                                                <input
                                                    type="number"
                                                    value={product.price}
                                                    onChange={(e) => handleUpdate(product.id, { price: Number(e.target.value) })}
                                                    placeholder="售價"
                                                    className="admin-input"
                                                    style={{ padding: '8px' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>原價（選填）</label>
                                                <input
                                                    type="number"
                                                    value={product.originalPrice || ''}
                                                    onChange={(e) => handleUpdate(product.id, { originalPrice: Number(e.target.value) })}
                                                    placeholder="原價"
                                                    className="admin-input"
                                                    style={{ padding: '8px' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>標籤</label>
                                                <select
                                                    value={product.tag || ''}
                                                    onChange={(e) => handleUpdate(product.id, { tag: e.target.value })}
                                                    className="admin-input"
                                                    style={{ padding: '8px', width: '100%' }}
                                                >
                                                    {tagOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>購買連結</label>
                                                <input
                                                    type="url"
                                                    value={product.url || ''}
                                                    onChange={(e) => handleUpdate(product.id, { url: e.target.value })}
                                                    placeholder="https://..."
                                                    className="admin-input"
                                                    style={{ padding: '8px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                                            {product.name}
                                            {product.tag && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    fontSize: '12px',
                                                    padding: '2px 6px',
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    borderRadius: '4px'
                                                }}>
                                                    {tagOptions.find(t => t.value === product.tag)?.label || product.tag}
                                                </span>
                                            )}
                                        </div>
                                        {product.description && (
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                                {product.description}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                                                NT${product.price?.toLocaleString()}
                                            </span>
                                            {product.originalPrice > product.price && (
                                                <>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: 'var(--color-text-muted)',
                                                        textDecoration: 'line-through'
                                                    }}>
                                                        NT${product.originalPrice?.toLocaleString()}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: 'var(--color-error)',
                                                        fontWeight: 500
                                                    }}>
                                                        -{getDiscountPercent(product.price, product.originalPrice)}%
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {product.url && (
                                            <a
                                                href={product.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontSize: '11px',
                                                    color: 'var(--color-text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    marginTop: '4px'
                                                }}
                                            >
                                                <ExternalLink style={{ width: 12, height: 12 }} />
                                                {product.url.substring(0, 30)}...
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 操作按鈕 */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {editingId === product.id ? (
                                    <motion.button
                                        onClick={() => setEditingId(null)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{
                                            background: 'var(--color-success)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Check style={{ width: 16, height: 16, color: 'white' }} />
                                    </motion.button>
                                ) : (
                                    <>
                                        <motion.button
                                            onClick={() => handleToggle(product.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: product.enabled ? 'var(--color-primary)' : 'var(--color-bg-hover)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                color: product.enabled ? 'white' : 'var(--color-text-secondary)'
                                            }}
                                            title={product.enabled ? '點擊停用' : '點擊啟用'}
                                        >
                                            {product.enabled ? '✓' : '○'}
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setEditingId(product.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: 'var(--color-bg-hover)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Edit2 style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(product.id)}
                                            whileHover={{ scale: 1.1 }}
                                            style={{
                                                background: 'var(--color-error)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px',
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

                {products.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: 'var(--color-text-muted)'
                    }}>
                        尚無商品，點擊「新增商品」開始建立
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

export default ProductEditor;
