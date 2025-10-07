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
} as const;

export type CommonKeys = keyof typeof common;
export default common;


