
'use server';

import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

/**
 * Saves user data to a specific path in the Firebase Realtime Database.
 * @param userId - The ID of the user.
 * @param path - The path within the user's data to save to (e.g., 'notes', 'todos').
 * @param data - The data to save.
 */
export async function saveUserData(userId: string, path: string, data: any) {
  try {
    const userRef = ref(db, `users/${userId}/${path}`);
    await set(userRef, data);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Could not save data to the cloud.");
  }
}

/**
 * Retrieves user data from a specific path in the Firebase Realtime Database.
 * @param userId - The ID of the user.
 * @param path - The path within the user's data to retrieve from.
 * @returns The data at the specified path, or null if it doesn't exist.
 */
export async function getUserData(userId: string, path: string) {
  try {
    const userRef = ref(db, `users/${userId}/${path}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw new Error("Could not retrieve data from the cloud.");
  }
}
