/**
 * Theme Definitions - 主題模板定義
 * 
 * 包含所有可用的主題設定
 */

export const THEMES = {
    // 免費版主題
    classic: {
        id: 'classic',
        name: '經典黑金',
        category: '商務',
        tier: 'free',
        colors: {
            primary: '#D4AF37',
            accent: '#FFD700',
            bgPrimary: '#0A0A0A',
            bgSecondary: '#141414',
            bgTertiary: '#1F1F1F',
            textPrimary: '#FFFFFF',
            textSecondary: '#B0B0B0',
            textMuted: '#666666',
        },
        preview: 'linear-gradient(135deg, #0A0A0A 0%, #1F1F1F 50%, #D4AF37 100%)'
    },
    fresh: {
        id: 'fresh',
        name: '清新白藍',
        category: '簡約',
        tier: 'free',
        colors: {
            primary: '#3B82F6',
            accent: '#60A5FA',
            bgPrimary: '#FFFFFF',
            bgSecondary: '#F8FAFC',
            bgTertiary: '#E2E8F0',
            textPrimary: '#1E293B',
            textSecondary: '#475569',
            textMuted: '#94A3B8',
        },
        preview: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #3B82F6 100%)'
    },
    // 專業版主題
    warm: {
        id: 'warm',
        name: '溫暖橙黃',
        category: '活力',
        tier: 'pro',
        colors: {
            primary: '#F59E0B',
            accent: '#FBBF24',
            bgPrimary: '#1C1917',
            bgSecondary: '#292524',
            bgTertiary: '#3D3835',
            textPrimary: '#FAFAF9',
            textSecondary: '#D6D3D1',
            textMuted: '#A8A29E',
        },
        preview: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #F59E0B 100%)'
    },
    tech: {
        id: 'tech',
        name: '科技紫霓',
        category: '未來',
        tier: 'pro',
        colors: {
            primary: '#8B5CF6',
            accent: '#A78BFA',
            bgPrimary: '#0F0E17',
            bgSecondary: '#1A1625',
            bgTertiary: '#2D2640',
            textPrimary: '#FFFFFE',
            textSecondary: '#A7A9BE',
            textMuted: '#6B6D84',
        },
        preview: 'linear-gradient(135deg, #0F0E17 0%, #1A1625 50%, #8B5CF6 100%)'
    },
    nature: {
        id: 'nature',
        name: '自然綠意',
        category: '環保',
        tier: 'pro',
        colors: {
            primary: '#10B981',
            accent: '#34D399',
            bgPrimary: '#022C22',
            bgSecondary: '#064E3B',
            bgTertiary: '#065F46',
            textPrimary: '#ECFDF5',
            textSecondary: '#A7F3D0',
            textMuted: '#6EE7B7',
        },
        preview: 'linear-gradient(135deg, #022C22 0%, #064E3B 50%, #10B981 100%)'
    },
    ocean: {
        id: 'ocean',
        name: '深海蔚藍',
        category: '沉穩',
        tier: 'pro',
        colors: {
            primary: '#0EA5E9',
            accent: '#38BDF8',
            bgPrimary: '#0C1929',
            bgSecondary: '#1E3A5F',
            bgTertiary: '#2D4A6F',
            textPrimary: '#F0F9FF',
            textSecondary: '#BAE6FD',
            textMuted: '#7DD3FC',
        },
        preview: 'linear-gradient(135deg, #0C1929 0%, #1E3A5F 50%, #0EA5E9 100%)'
    },
    // 企業版主題
    luxury: {
        id: 'luxury',
        name: '奢華玫瑰金',
        category: '精品',
        tier: 'enterprise',
        colors: {
            primary: '#EC4899',
            accent: '#F472B6',
            bgPrimary: '#18181B',
            bgSecondary: '#27272A',
            bgTertiary: '#3F3F46',
            textPrimary: '#FAFAFA',
            textSecondary: '#D4D4D8',
            textMuted: '#A1A1AA',
        },
        preview: 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #EC4899 100%)'
    },
    midnight: {
        id: 'midnight',
        name: '午夜星空',
        category: '夢幻',
        tier: 'enterprise',
        colors: {
            primary: '#6366F1',
            accent: '#818CF8',
            bgPrimary: '#030712',
            bgSecondary: '#111827',
            bgTertiary: '#1F2937',
            textPrimary: '#F9FAFB',
            textSecondary: '#D1D5DB',
            textMuted: '#9CA3AF',
        },
        preview: 'linear-gradient(135deg, #030712 0%, #111827 50%, #6366F1 100%)'
    },
};

/**
 * 根據方案取得可用主題
 */
export const getAvailableThemes = (userPlan) => {
    const tierOrder = { free: 0, pro: 1, enterprise: 2 };
    const userTier = tierOrder[userPlan] || 0;

    return Object.values(THEMES).filter(theme => {
        const themeTier = tierOrder[theme.tier] || 0;
        return themeTier <= userTier;
    });
};

/**
 * 應用主題到 CSS 變數
 */
export const applyTheme = (themeId) => {
    const theme = THEMES[themeId];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    });
};

export default THEMES;
