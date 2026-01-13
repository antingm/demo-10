/**
 * ==========================================
 * App 主元件 - 路由設定
 * ==========================================
 * 
 * 功能說明：
 * - 設定前台/後台路由
 * - 整合 AuthProvider、ProfileProvider、PlanProvider
 * - 路由保護機制
 * 
 * 路由結構：
 * - / → 前台 Bio-Link 展示頁
 * - /login → 後台登入頁
 * - /admin → 後台管理頁（需登入）
 * - /upgrade → 方案升級頁
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { PlanProvider } from './context/PlanContext';

// 頁面元件
import BioLinkPage from './pages/BioLinkPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UpgradePage from './pages/UpgradePage';

// 保護路由元件
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App 主元件
 * 整合所有 Provider 與路由設定
 */
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProfileProvider>
                    <PlanProvider>
                        <Routes>
                            {/* 前台：Bio-Link 展示頁（公開） */}
                            <Route path="/" element={<BioLinkPage />} />

                            {/* 後台：登入頁面 */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* 方案升級頁面 */}
                            <Route path="/upgrade" element={<UpgradePage />} />

                            {/* 後台：管理頁面（需登入） */}
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute>
                                        <AdminPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </PlanProvider>
                </ProfileProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;

