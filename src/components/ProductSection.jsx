/**
 * ==========================================
 * ProductSection 元件 - 商品區塊
 * ==========================================
 * 
 * 功能說明：
 * - 顯示商品網格或輪播
 * - 支援區塊標題
 * - 自動切換顯示模式
 * 
 * 使用方式：
 * <ProductSection products={productsArray} title="熱銷商品" />
 */

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductSection = ({ products = [], title, icon, layout = 'grid' }) => {
    // 篩選已啟用的商品
    const activeProducts = products.filter(p => p.enabled !== false);

    // 如果沒有商品，不渲染
    if (activeProducts.length === 0) return null;

    // 容器動畫
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* 區塊標題 */}
            {title && (
                <h2 className="section-title">
                    {icon && <span className="section-title__icon">{icon}</span>}
                    {title}
                </h2>
            )}

            {/* 商品展示 */}
            {layout === 'carousel' ? (
                // 輪播模式
                <div className="product-carousel">
                    {activeProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))}
                </div>
            ) : (
                // 網格模式
                <motion.div
                    className="product-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {activeProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))}
                </motion.div>
            )}
        </motion.section>
    );
};

export default ProductSection;
