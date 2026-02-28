import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken, ensureCurrentUser } from '../api/authApi';

const REDIRECT_KEY = 'redirectAfterLogin';

export const ProtectedRoute = ({ element }) => {
    const token = getToken();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [hasValidAuth, setHasValidAuth] = useState(false);

    useEffect(() => {
        const validateAuth = async () => {
            setIsLoading(true);

            // If no token, not authenticated
            if (!token) {
                setHasValidAuth(false);
                setIsLoading(false);
                return;
            }

            try {
                const user = await ensureCurrentUser();
                setHasValidAuth(!!user);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setHasValidAuth(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateAuth();
    }, [token, location.pathname]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Not authenticated
    if (!hasValidAuth) {
        sessionStorage.setItem(REDIRECT_KEY, location.pathname);
        return <Navigate to="/login" replace />;
    }

    return element;
};

export const getRedirectPath = () => {
    const path = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return path || '/compte/inici';
};
