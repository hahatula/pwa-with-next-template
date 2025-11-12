import type { ClassLevel, ClassType } from "@/lib/types";
import type { ClassesKeys } from '@/lib/i18n/classes';
import { levelKey, typeKey } from '@/lib/values/dropdowns';
import AdvancedIcon from '@/components/icons/level/Advansed';
import BeginnerIcon from '@/components/icons/level/Beginner';
import KidsIcon from '@/components/icons/level/Kids';
import AllLevelsIcon from '@/components/icons/level/AllLevels';
import MasterIcon from '@/components/icons/level/Master';
import WomenIcon from '@/components/icons/level/Women';
import GiIcon from '@/components/icons/type/Gi';
import NoGiIcon from '@/components/icons/type/NoGi';
import OpenMatIcon from '@/components/icons/type/OpenMat';
import MMAIcon from '@/components/icons/type/Mma';
import FunctionalIcon from '@/components/icons/type/Functional';

export function getLevelKey(level: ClassLevel): ClassesKeys {
    return levelKey[level];
}

export function getTypeKey(type: ClassType): ClassesKeys {
    return typeKey[type];
}

export function getLocalizedLevel(level: ClassLevel, t: (key: string) => string): string {
    const key = getLevelKey(level);
    return t(key) || level;
}

export function getLocalizedType(type: ClassType, t: (key: string) => string): string {
    const key = getTypeKey(type);
    return t(key) || type;
}

export function getLevelIcon(level: ClassLevel) {
    switch (level) {
        case 'All Levels':
            return AllLevelsIcon;
        case 'Master':
            return MasterIcon;
        case 'Advanced':
            return AdvancedIcon;
        case 'Beginner':
            return BeginnerIcon;
        case 'Women':
            return WomenIcon;
        case 'Kids':
            return KidsIcon;
        default:
            return undefined;
    }
}

export function getClassTypeIcon(type: ClassType) {
    switch (type) {
        case 'Gi':
            return GiIcon;
        case 'No-Gi':
            return NoGiIcon;
        case 'Open Mat':
            return OpenMatIcon;
        case 'MMA':
            return MMAIcon;
        case 'Functional':
            return FunctionalIcon;
        default:
            return undefined;
    }
}
