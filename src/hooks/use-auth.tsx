'use client';

import { useState, useEffect, createContext, useContext, ComponentType } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/loading-screen';

const ADMIN_EMAIL = 'apoorvkaranwalwhat@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const withAuth = <P extends object>(Component: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login');
      }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
      return <LoadingScreen />;
    }

    return <Component {...props} />;
  };
  AuthComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
  return AuthComponent;
};

export const withAdminAuth = <P extends object>(Component: ComponentType<P>) => {
    const AdminAuthComponent = (props: P) => {
        const { user, isAdmin, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    router.push('/login');
                } else if (!isAdmin) {
                    router.push('/');
                }
            }
        }, [user, isAdmin, isLoading, router]);

        if (isLoading || !user || !isAdmin) {
            return <LoadingScreen />;
        }

        return <Component {...props} />;
    };
    AdminAuthComponent.displayName = `WithAdminAuth(${Component.displayName || Component.name || 'Component'})`;
    return AdminAuthComponent;
};
