export type ClassLevel = 'Kids' | 'Beginner' | 'All Levels' | 'Advanced' | 'Master' | 'Women';
export type ClassType = 'Gi' | 'No-Gi' | 'Open Mat' | 'MMA' | 'Functional';


// Keys to use with t('classes') namespace so we can show localized labels
import type { ClassesKeys } from '@/lib/i18n/classes';
import type { WeekKeys } from '@/lib/i18n/week';

export const levels: ClassLevel[] = ['Kids', 'Beginner', 'All Levels', 'Advanced', 'Master', 'Women'];
export const levelKey = {
    'Kids': 'levelKids',
    'Beginner': 'levelBeginner',
    'All Levels': 'levelAllLevels',
    'Advanced': 'levelAdvanced',
    'Master': 'levelMaster',
    'Women': 'levelWomen',   
} as const satisfies Record<ClassLevel, ClassesKeys>;

export const types: ClassType[] = ['Gi', 'No-Gi', 'Open Mat', 'MMA', 'Functional'];
export const typeKey = {
    'Gi': 'typeGi',
    'No-Gi': 'typeNoGi',
    'Open Mat': 'typeOpenMat',
    'MMA': 'typeMMA',
    'Functional': 'typeFunctional'
} as const satisfies Record<ClassType, ClassesKeys>;

export const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const weekdayKey = {
    'Sun': 'sun',
    'Mon': 'mon',
    'Tue': 'tue',
    'Wed': 'wed',
    'Thu': 'thu',
    'Fri': 'fri',
    'Sat': 'sat',
} as const satisfies Record<string, WeekKeys>;