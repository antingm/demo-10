/**
 * ==========================================
 * UpgradePage - 方案升級頁面
 * ==========================================
 * 
 * 功能說明：
 * - 方案比較表
 * - 升級按鈕
 * - 功能對照
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Check,
    X,
    Zap,
    Crown,
    Building2,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { usePlan, PLANS, FEATURE_LABELS } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';

const UpgradePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { userPlan, upgradePlan } = usePlan();
    const [upgrading, setUpgrading] = useState(null);
    const [success, setSuccess] = useState(null);

    const planIcons = {
        free: Zap,
        pro: Crown,
        enterprise: Building2
    };

    const handleUpgrade = async (planId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setUpgrading(planId);
        try {
            await upgradePlan(planId);
            setSuccess(planId);
            setTimeout(() => {
                setSuccess(null);
                navigate('/admin');
            }, 2000);
        } catch (error) {
            alert('升級失敗：' + error.message);
        } finally {
            setUpgrading(null);
        }
    };

    const renderFeatureValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? (
                <Check style={{ color: 'var(--color-success)', width: 20, height: 20 }} />
            ) : (
                <X style={{ color: 'var(--color-text-muted)', width: 20, height: 20 }} />
            );
        }
        if (value === 999) return '無限';
        return value;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            padding: '40px 20px'
        }}>
            {/* 返回按鈕 */}
            <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ x: -4 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    fontSize: '14px'
                }}
            >
                <ArrowLeft style={{ width: 18, height: 18 }} />
                返回
            </motion.button>

            {/* 標題 */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '12px'
                    }}
                >
                    <Sparkles style={{ display: 'inline', marginRight: '12px', color: 'var(--color-primary)' }} />
                    選擇您的方案
                </motion.h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                    終身買斷，一次付費永久使用
                </p>
            </div>

            {/* 方案卡片 */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {Object.values(PLANS).map((plan, index) => {
                    const Icon = planIcons[plan.id];
                    const isCurrentPlan = userPlan === plan.id;
                    const isPopular = plan.popular;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                width: '320px',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: '20px',
                                padding: '32px 24px',
                                position: 'relative',
                                border: isPopular
                                    ? '2px solid var(--color-primary)'
                                    : '1px solid var(--color-bg-tertiary)',
                                boxShadow: isPopular
                                    ? '0 20px 60px rgba(16, 185, 129, 0.2)'
                                    : '0 10px 40px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* 推薦標籤 */}
                            {isPopular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                    color: 'white',
                                    padding: '4px 16px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}>
                                    最受歡迎
                                </div>
                            )}

                            {/* 方案圖示 */}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: isPopular
                                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                    : 'var(--color-bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px'
                            }}>
                                <Icon style={{
                                    width: 28,
                                    height: 28,
                                    color: isPopular ? 'white' : 'var(--color-text-secondary)'
                                }} />
                            </div>

                            {/* 方案名稱 */}
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--color-text-primary)',
                                marginBottom: '8px'
                            }}>
                                {plan.name}
                            </h3>

                            <p style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '14px',
                                marginBottom: '20px'
                            }}>
                                {plan.description}
                            </p>

                            {/* 價格 */}
                            <div style={{ marginBottom: '24px' }}>
                                <span style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: 'var(--color-text-primary)'
                                }}>
                                    {plan.priceLabel}
                                </span>
                                {plan.priceNote && (
                                    <span style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '14px',
                                        marginLeft: '8px'
                                    }}>
                                        {plan.priceNote}
                                    </span>
                                )}
                            </div>

                            {/* 功能列表 */}
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 24px 0'
                            }}>
                                {Object.entries(plan.features).map(([key, value]) => (
                                    <li
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 0',
                                            borderBottom: '1px solid var(--color-bg-tertiary)',
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span>{FEATURE_LABELS[key]}</span>
                                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {renderFeatureValue(value)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* 升級按鈕 */}
                            <motion.button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrentPlan || upgrading === plan.id}
                                whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                                whileTap={{ scale: isCurrentPlan ? 1 : 0.98 }}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isCurrentPlan
                                        ? 'var(--color-bg-tertiary)'
                                        : success === plan.id
                                            ? 'var(--color-success)'
                                            : isPopular
                                                ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                                                : 'var(--color-primary)',
                                    color: isCurrentPlan ? 'var(--color-text-muted)' : 'white',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    cursor: isCurrentPlan ? 'default' : 'pointer'
                                }}
                            >
                                {isCurrentPlan
                                    ? '目前方案'
                                    : success === plan.id
                                        ? '✓ 升級成功！'
                                        : upgrading === plan.id
                                            ? '處理中...'
                                            : plan.id === 'free'
                                                ? '開始使用'
                                                : '立即升級'}
                            </motion.button>
                        </motion.div>
                    );
                })}
            </div>

            {/* 底部說明 */}
            <div style={{
                textAlign: 'center',
                marginTop: '48px',
                padding: '24px',
                color: 'var(--color-text-muted)',
                fontSize: '14px'
            }}>
                <p>💡 所有方案皆為終身買斷制，無需月費</p>
                <p style={{ marginTop: '8px' }}>
                    有任何問題？請聯繫 <a href="mailto:support@anting-studio.com" style={{ color: 'var(--color-primary)' }}>support@anting-studio.com</a>
                </p>
            </div>
        </div>
    );
};

export default UpgradePage;
