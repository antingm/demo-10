/**
 * ==========================================
 * App 主元件 - 路由設定
 * ==========================================
 * 
 * 功能說明：
 * - 設定前台/後台路由
 * - 整合 AuthProvider 與 ProfileProvider
 * - 路由保護機制
 * 
 * 路由結構：
 * - / → 前台 Bio-Link 展示頁
 * - /login → 後台登入頁
 * - /admin → 後台管理頁（需登入）
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';

// 頁面元件
import BioLinkPage from './pages/BioLinkPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

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
                    <Routes>
                        {/* 前台：Bio-Link 展示頁（公開） */}
                        <Route path="/" element={<BioLinkPage />} />

                        {/* 後台：登入頁面 */}
                        <Route path="/login" element={<LoginPage />} />

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
                </ProfileProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
