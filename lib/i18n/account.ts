const account = {
    myAccount: {
        en: 'My account',
        he: 'החשבון שלי'
    },
    editProfile: {
        en: 'Edit profile',
        he: 'עריכת פרופיל'
    },
    myUpcomingClasses: {
        en: 'My upcoming classes',
        he: 'השיעורים הבאים שלי'
    },
    noUpcomingClasses: {
        en: 'No upcoming classes',
        he: 'אין שיעורים באופן זמני'
    },
    adminWorkspace: {
        en: 'Admin workspace',
        he: 'מרחב ניהול'
    },
    pushNotifications: {
        en: 'Push notifications',
        he: 'התראות בדיקה'
    },
    profilePicture: {
        en: 'Profile picture',
        he: 'תמונת פרופיל'
    },
    phoneNumber: {
        en: 'Phone number',
        he: 'מספר טלפון'
    },
    yourName: {
        en: 'Your name',
        he: 'שמך'
    },
    failedToUploadProfilePicture: {
        en: 'Failed to upload profile picture',
        he: 'התמונה לא נטענה'
    },
    failedToSaveChanges: {
        en: 'Failed to save changes',
        he: 'השינויים לא נשמרו'
    },
    phoneNumberNote: {
        en: 'Only admins will see your phone number',
        he: 'רק מנהלים יכולים לראות את המספר הטלפון שלך'
    },
} as const;

export type AccountKeys = keyof typeof account;
export default account;
