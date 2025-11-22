const common = {
    login: {
        en: 'Log in',
        he: 'התחברות'
    },
    logout: {
        en: 'Log out',
        he: 'התנתקות'
    },
    signup: {
        en: 'Sign up',
        he: 'הרשמה'
    },
    createAccount: {
        en: 'Create account',
        he: 'יצירת חשבון'
    },
    add: {
        en: 'Add',
        he: 'הוסף'
    },
    edit: {
        en: 'Edit',
        he: 'ערוך'
    },
    delete: {
        en: 'Delete',
        he: 'מחק'
    },
    save: {
        en: 'Save',
        he: 'שמור'
    },
    saving: {
        en: 'Saving...',
        he: '...שומר'
    },
    saveChanges: {
        en: 'Save changes',
        he: 'שמור השינויים'
    },
    cancel: {
        en: 'Cancel',
        he: 'בטל'
    },
    confirm: {
        en: 'Confirm',
        he: 'אישור'
    },
    close: {
        en: 'Close',
        he: 'סגירה'
    },
    shabbatShalom: {
        en: 'Shabbat Shalom',
        he: 'שבת שלום'
    },
    enable: {
        en: 'Enable',
        he: 'הפעל'
    },
    disable: {
        en: 'Disable',
        he: 'השבת'
    },
    loading: {
        en: 'Loading...',
        he: '...טוען'
    },
    uploading: {
        en: 'Uploading...',
        he: '...מעלה'
    },
    back: {
        en: 'Back',
        he: 'חזור'
    },
} as const;

export type CommonKeys = keyof typeof common;
export default common;


