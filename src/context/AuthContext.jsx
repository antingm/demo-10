/**
 * ==========================================
 * AuthContext - 驗證狀態管理
 * ==========================================
 * 
 * 功能說明：
 * - 管理使用者登入狀態
 * - 提供 Google 登入/登出功能
 * - 監聽驗證狀態變化
 * 
 * 使用方式：
 * const { user, loading, signInWithGoogle, signOut } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// 建立 Context
const AuthContext = createContext(null);

/**
 * AuthProvider - 驗證狀態提供者
 * 包裝整個應用程式以提供驗證功能
 */
export const AuthProvider = ({ children }) => {
    // 狀態：當前使用者
    const [user, setUser] = useState(null);
    // 狀態：載入中（檢查登入狀態）
    const [loading, setLoading] = useState(true);

    // 監聽驗證狀態變化
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // 清理訂閱
        return () => unsubscribe();
    }, []);

    /**
     * 使用 Google 帳號登入
     * @returns {Promise<void>}
     */
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Google 登入失敗：', error);
            throw error;
        }
    };

    /**
     * 登出
     * @returns {Promise<void>}
     */
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('登出失敗：', error);
            throw error;
        }
    };

    // Context 值
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth Hook - 取得驗證狀態
 * @returns {Object} 驗證狀態與方法
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth 必須在 AuthProvider 內使用');
    }
    return context;
};

export default AuthContext;
