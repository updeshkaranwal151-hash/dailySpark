
'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'daily-spark-favorites';

export const useFavorites = (toolId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const favorites: string[] = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(toolId));
      }
    } catch (error) {
      console.error("Failed to read favorites from local storage", error);
    }
  }, [toolId]);

  const toggleFavorite = useCallback(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      const newFavorites = favorites.includes(toolId)
        ? favorites.filter(id => id !== toolId)
        : [...favorites, toolId];
        
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setIsFavorite(newFavorites.includes(toolId));
      
      // Dispatch a storage event to notify other components/tabs
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error("Failed to update favorites in local storage", error);
    }
  }, [toolId]);

  return { isFavorite, toggleFavorite };
};

export const useAllFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const updateFavorites = useCallback(() => {
        try {
            const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (savedFavorites) {
                setFavoriteIds(JSON.parse(savedFavorites));
            } else {
                setFavoriteIds([]);
            }
        } catch (error) {
            console.error("Failed to read favorites from local storage", error);
            setFavoriteIds([]);
        }
    }, []);

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
