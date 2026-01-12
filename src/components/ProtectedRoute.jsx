/**
 * ==========================================
 * ProtectedRoute - 保護路由元件
 * ==========================================
 * 
 * 功能說明：
 * - 檢查使用者是否已登入
 * - 未登入則跳轉至登入頁面
 * 
 * 使用方式：
 * <ProtectedRoute><AdminPage /></ProtectedRoute>
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // 載入中狀態
    if (loading) {
        return (
            <div className="login-page">
                <div className="loading">
                    <div className="loading__spinner" />
                </div>
            </div>
        );
    }

    // 未登入則跳轉至登入頁
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 已登入則渲染子元件
    return children;
};

export default ProtectedRoute;
