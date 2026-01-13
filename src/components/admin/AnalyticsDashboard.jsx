/**
 * ==========================================
 * AnalyticsDashboard - 數據分析儀表板
 * ==========================================
 * 
 * 功能說明：
 * - 顯示統計數據
 * - 圖表視覺化
 * - 近期事件列表
 * 
 * 企業版功能
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Eye,
    MousePointer,
    TrendingUp,
    Clock,
    RefreshCw,
    Crown
} from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { useNavigate } from 'react-router-dom';

// 模擬數據（Demo 用）
const generateMockData = () => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date().getDay();

    return Array.from({ length: 7 }, (_, i) => ({
        name: days[(today - 6 + i + 7) % 7],
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 30) + 5
    }));
};

const mockClickSources = [
    { name: '快速連結', value: 45, color: '#10B981' },
    { name: '社群連結', value: 30, color: '#3B82F6' },
    { name: '商品', value: 20, color: '#F59E0B' },
    { name: '聯絡資訊', value: 5, color: '#EC4899' }
];

const mockRecentEvents = [
    { id: 1, type: 'page_view', time: '2 分鐘前', detail: '頁面瀏覽' },
    { id: 2, type: 'link_click', time: '5 分鐘前', detail: '點擊：官方商城' },
    { id: 3, type: 'social_click', time: '12 分鐘前', detail: '點擊：Instagram' },
    { id: 4, type: 'product_click', time: '25 分鐘前', detail: '點擊：手工陶瓷杯' },
    { id: 5, type: 'page_view', time: '1 小時前', detail: '頁面瀏覽' },
];

const AnalyticsDashboard = () => {
    const { isEnterprise } = usePlan();
    const navigate = useNavigate();
    const [refreshing, setRefreshing] = useState(false);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        setWeeklyData(generateMockData());
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setWeeklyData(generateMockData());
            setRefreshing(false);
        }, 1000);
    };

    // 計算總計
    const totals = useMemo(() => ({
        views: weeklyData.reduce((sum, d) => sum + d.views, 0),
        clicks: weeklyData.reduce((sum, d) => sum + d.clicks, 0)
    }), [weeklyData]);

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
                        數據分析為企業版功能
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        marginBottom: '24px',
                        maxWidth: '400px',
                        margin: '0 auto 24px'
                    }}>
                        升級至企業版即可解鎖完整的數據分析功能，包括訪客統計、點擊追蹤、趨勢圖表等。
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
            {/* 頂部統計卡片 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                {[
                    { label: '本週瀏覽', value: totals.views, icon: Eye, color: '#10B981' },
                    { label: '本週點擊', value: totals.clicks, icon: MousePointer, color: '#3B82F6' },
                    { label: '點擊率', value: `${((totals.clicks / totals.views) * 100).toFixed(1)}%`, icon: TrendingUp, color: '#F59E0B' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'var(--color-bg-secondary)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `${stat.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <stat.icon style={{ width: 24, height: 24, color: stat.color }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                {stat.value}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 圖表區域 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* 週趨勢圖表 */}
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>週趨勢分析</h3>
                        <motion.button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                background: 'var(--color-bg-tertiary)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <RefreshCw style={{
                                width: 16,
                                height: 16,
                                color: 'var(--color-text-secondary)',
                                animation: refreshing ? 'spin 1s linear infinite' : 'none'
                            }} />
                        </motion.button>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bg-tertiary)" />
                            <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                            <YAxis stroke="var(--color-text-muted)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-bg-tertiary)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="views" name="瀏覽" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="clicks" name="點擊" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 點擊來源分佈 */}
                <div className="admin-card">
                    <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-text-primary)' }}>點擊來源</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={mockClickSources}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {mockClickSources.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                        {mockClickSources.map(source => (
                            <div key={source.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: source.color }} />
                                <span style={{ color: 'var(--color-text-secondary)' }}>{source.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 近期活動 */}
            <div className="admin-card">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-primary)' }}>
                    <Clock style={{ width: 18, height: 18, display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    近期活動
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {mockRecentEvents.map(event => (
                        <div
                            key={event.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '12px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '8px'
                            }}
                        >
                            <span style={{ color: 'var(--color-text-primary)' }}>{event.detail}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{event.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
};

export default AnalyticsDashboard;
