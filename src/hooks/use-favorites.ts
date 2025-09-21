
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { getUserData, saveUserData } from '@/services/database';

export const useFavorites = (toolId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserData(user.uid, 'favorites').then((favorites: string[] | null) => {
        if (favorites) {
          setIsFavorite(favorites.includes(toolId));
        }
      });
    }
  }, [user, toolId]);

  const toggleFavorite = useCallback(async () => {
    if (!user) return;

    const savedFavorites = await getUserData(user.uid, 'favorites') || [];
    const favorites: string[] = Array.isArray(savedFavorites) ? savedFavorites : [];
    
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
      
    await saveUserData(user.uid, 'favorites', newFavorites);
    setIsFavorite(newFavorites.includes(toolId));
    
    // Dispatch a storage event to notify other components/tabs
    window.dispatchEvent(new Event('storage'));
  }, [toolId, user]);

  return { isFavorite, toggleFavorite };
};

export const useAllFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const { user } = useAuth();

    const updateFavorites = useCallback(async () => {
        if (user) {
            const favorites = await getUserData(user.uid, 'favorites');
            if (favorites && Array.isArray(favorites)) {
                setFavoriteIds(favorites);
            } else {
                setFavoriteIds([]);
            }
        }
    }, [user]);

    useEffect(() => {
        updateFavorites();
        
        const handleStorageChange = () => {
            updateFavorites();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [updateFavorites]);

    return favoriteIds;
}
