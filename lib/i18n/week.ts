const week = {
    sun: {
        en: 'Sunday',
        he: 'יום ראשון'
    },
    mon: {
        en: 'Monday',
        he: 'יום שני'
    },
    tue: {
        en: 'Tuesday',
        he: 'יום שלישי'
    },
    wed: {
        en: 'Wednesday',
        he: 'יום רביעי'
    },
    thu: {
        en: 'Thursday',
        he: 'יום חמישי'
    },
    fri: {
        en: 'Friday',
        he: 'יום שישי'
    },
    sat: {
        en: 'Saturday',
        he: 'יום שבת'
    },
    sunShort: {
        en: 'Sun',
        he: 'א'
    },
    monShort: {
        en: 'Mon',
        he: 'ב'
    },
    tueShort: {
        en: 'Tue',
        he: 'ג'
    },
    wedShort: {
        en: 'Wed',
        he: 'ד'
    },
    thuShort: {
        en: 'Thu',
        he: 'ה'
    },
    friShort: {
        en: 'Fri',
        he: 'ו'
    },
    satShort: {
        en: 'Sat',
        he: 'ז'
    },
    currentWeek: {
        en: 'Current week',
        he: 'שבוע נוכחי'
    },
    nextWeek: {
        en: 'Next week',
        he: 'שבוע הבא'
    },
} as const;

export type WeekKeys = keyof typeof week;
export default week;


