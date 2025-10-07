const auth = {
    noAccount: {
        en: 'Don\'t have an account? Please register',
        he: 'אין לך חשבון? נא להירשם'
    },
    haveAccount: {
        en: 'Already have an account? Please log in',
        he: 'יש לך חשבון? נא להתחבר'
    },
    withGoogle: {
        en: 'Continue with Google',
        he: 'Google המשך עם'
    },
    withFacebook: {
        en: 'Continue with Facebook',
        he: 'Facebook המשך עם'
    }
} as const;

export type AuthKeys = keyof typeof auth;
export default auth;