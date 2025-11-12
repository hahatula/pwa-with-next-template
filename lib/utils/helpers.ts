import type { BilingualText } from '@/lib/types';

/**
 * Safely extracts bilingual text from Firestore document data
 * @param obj - The object that might contain bilingual text
 * @returns BilingualText with en and he properties
 */
export function getBilingualText(obj: unknown): BilingualText {
    const data = obj as Record<string, unknown> | undefined;
    return {
        en: (data?.en as string) ?? '',
        he: (data?.he as string) ?? '',
    };
}