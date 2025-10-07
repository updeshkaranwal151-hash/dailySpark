
'use client';

import { useState, useEffect, createContext, useContext, ComponentType } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/loading-screen';
import { GEMINI_API_KEY_STORAGE_KEY } from '@/lib/constants';

const ADMIN_EMAIL = 'apoorvkaranwalwhat@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasApiKey: boolean;
  checkApiKey: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  hasApiKey: false,
  checkApiKey: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const router = useRouter();
  
  const checkApiKey = () => {
    const key = typeof window !== 'undefined' ? localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) : null;
    setHasApiKey(!!key);
    return !!key;
  };

  useEffect(() => {
    if (auth) {
        const unsubscribe = auth.onAuthStateChanged(user => {
        setUser(user);
        if(user) {
            if (!checkApiKey()) {
                router.push('/welcome');
            }
        }
        setIsLoading(false);
        });

        return () => unsubscribe();
    } else {
        setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    checkApiKey();
    const handleStorageChange = () => {
        checkApiKey();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, [])

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, hasApiKey, checkApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const withAuth = <P extends object>(Component: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, isLoading, hasApiKey } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
            router.push('/login');
        } else if (!hasApiKey) {
            router.push('/welcome');
        }
      }
    }, [user, isLoading, hasApiKey, router]);

    if (isLoading || !user || !hasApiKey) {
      return <LoadingScreen isLoaded={!isLoading && !!user && hasApiKey} />;
    }

    return <Component {...props} />;
  };
  AuthComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
  return AuthComponent;
};

export const withAdminAuth = <P extends object>(Component: ComponentType<P>) => {
    const AdminAuthComponent = (props: P) => {
        const { user, isAdmin, isLoading, hasApiKey } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    router.push('/login');
                } else if (!hasApiKey) {
                    router.push('/welcome');
                } else if (!isAdmin) {
                    router.push('/');
                }
            }
        }, [user, isAdmin, isLoading, hasApiKey, router]);

        if (isLoading || !user || !isAdmin || !hasApiKey) {
            return <LoadingScreen isLoaded={!isLoading && !!user && hasApiKey && isAdmin} />;
        }

        return <Component {...props} />;
    };
    AdminAuthComponent.displayName = `WithAdminAuth(${Component.displayName || Component.name || 'Component'})`;
    return AdminAuthComponent;
};
