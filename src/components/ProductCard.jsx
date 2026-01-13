/**
 * ==========================================
 * ProductCard 元件 - 商品卡片
 * ==========================================
 * 
 * 功能說明：
 * - 顯示商品圖片、名稱、價格
 * - 支援標籤（新品/熱銷/特價）
 * - 溫暖質感互動動畫
 * 
 * 使用方式：
 * <ProductCard product={productData} />
 */

import { motion } from 'framer-motion';

const ProductCard = ({ product, onClick }) => {
    // 標籤樣式對應
    const tagStyles = {
        new: 'product-card__tag--new',
        hot: 'product-card__tag--hot',
        sale: 'product-card__tag--sale'
    };

    // 標籤文字對應
    const tagLabels = {
        new: '新品',
        hot: '熱銷',
        sale: '特價'
    };

    /**
     * 處理卡片點擊
     */
    const handleClick = () => {
        if (product.url) {
            window.open(product.url, '_blank', 'noopener,noreferrer');
        }
        if (onClick) {
            onClick(product);
        }
    };

    return (
        <motion.div
            className="product-card"
            onClick={handleClick}
            whileHover={{ y: -4 }}
            whileTap={{ y: -2, scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* 商品圖片 */}
            <img
                src={product.image || 'https://via.placeholder.com/200?text=商品圖片'}
                alt={product.name}
                className="product-card__image"
            />

            {/* 商品內容 */}
            <div className="product-card__content">
                {/* 標籤 */}
                {product.tag && (
                    <span className={`product-card__tag ${tagStyles[product.tag] || ''}`}>
                        {tagLabels[product.tag] || product.tag}
                    </span>
                )}

                {/* 商品名稱 */}
                <h3 className="product-card__name">{product.name}</h3>

                {/* 價格 */}
                <div>
                    <span className="product-card__price">
                        ${product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="product-card__original-price">
                            ${product.originalPrice?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
