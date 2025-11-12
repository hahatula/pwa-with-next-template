const classes = {
    manageClasses: {
        en: 'Manage classes',
        he: 'ניהול אימונים'
    },
    addNewClass: {
        en: 'Add new class',
        he: 'הוסף אימון חדש'
    },
    editClass: {
        en: 'Edit class details',
        he: 'ערוך פרטי אימון'
    },
    classDetails: {
        en: 'Class details',
        he: 'פרטי אימון'
    },
    title: {
        en: 'Title',
        he: 'כותרת'
    },
    coach: {
        en: 'Coach',
        he: 'מורה'
    },
    level: {
        en: 'Level',
        he: 'רמה'
    },
    type: {
        en: 'Type',
        he: 'סוג'
    },
    levelKids: { en: 'Kids', he: 'ילדים' },
    levelBeginner: { en: 'Beginner', he: 'מתחילים' },
    levelAllLevels: { en: 'All Levels', he: 'כל הרמות' },
    levelAdvanced: { en: 'Advanced', he: 'מתקדמים' },
    levelMaster: { en: 'Master', he: 'מאסטר' },
    levelWomen: { en: 'Women', he: 'נשים' },
    typeGi: { en: 'Gi', he: 'גי' },
    typeNoGi: { en: 'No-Gi', he: 'בלי גי' },
    typeOpenMat: { en: 'Open Mat', he: 'אופן מאט' },
    typeMMA: { en: 'MMA' },
    typeFunctional: { en: 'Functional', he: 'פונקציונלי' },
    repeatedWeekly: {
        en: 'Repeated weekly',
        he: 'חוזר בשבועיות'
    },
    active: {
        en: 'Active',
        he: 'פעיל'
    },
    outdated: {
        en: 'Outdated',
        he: 'מיושן'
    },
    startDate: {
        en: 'Start date',
        he: 'תאריך התחלה'
    },
    weekday: {
        en: 'Weekday',
        he: 'יום בשבוע'
    },
    eventDate: {
        en: 'Event date',
        he: 'תאריך אירוע'
    },
    startTime: {
        en: 'Start time',
        he: 'שעה התחלה'
    },
    endTime: {
        en: 'End time',
        he: 'שעה סיום'
    },
    createdBy: {
        en: 'Created by',
        he: 'נוצר על ידי'
    },
    updatedBy: {
        en: 'Updated by',
        he: 'עודכן על ידי'
    },
    noClassesFound: {
        en: 'No classes found',
        he: 'אין אימונים נמצאו'
    },
} as const;

export type ClassesKeys = keyof typeof classes;
export default classes;


