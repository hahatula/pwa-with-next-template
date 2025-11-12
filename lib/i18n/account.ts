const account = {
    myAccount: {
        en: 'My account',
        he: 'החשבון שלי'
    },
    myUpcomingClasses: {
        en: 'My upcoming classes',
        he: 'השיעורים הבאים שלי'
    },

    adminWorkspace: {
        en: 'Admin workspace',
        he: 'מרחב ניהול'
    }

} as const;

export type AccountKeys = keyof typeof account;
export default account;


