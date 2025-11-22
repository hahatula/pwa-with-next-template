import type { User } from 'firebase/auth';

export function getUserDisplayName(authUser: User | null, firestoreData?: { name?: string; displayName?: string }): string {
  // Priority: custom name > cached displayName > auth displayName > email
  return firestoreData?.name 
    || firestoreData?.displayName 
    || authUser?.displayName 
    || authUser?.email?.split('@')[0] 
    || 'User';
}

export function getUserPhotoURL(authUser: User | null, firestoreData?: { customPhotoURL?: string; photoURL?: string }): string | null {
  // Priority: custom avatar > cached Google photo > auth photo > provider photo
  return firestoreData?.customPhotoURL 
    || firestoreData?.photoURL 
    || authUser?.photoURL 
    || authUser?.providerData?.find(p => p.photoURL)?.photoURL 
    || null;
}