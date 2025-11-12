const schedule = {
    schedule: {
        en: 'Schedule',
        he: 'לוח שעות'
    },
    chooseYourClass: {
        en: 'Choose your class and sign up',
        he: 'בחר את השיעור שברצונך להירשם לו'
    },
    participants: {
        en: 'Participants',
        he: 'משתתפים'
    },
    noParticipantsYet: {
        en: 'No participants yet',
        he: 'אין משתתפים עדיין'
    },
    youAreSignedUp: {
        en: 'You are signed up',
        he: 'אתה רשום'
    }
} as const;

export type ScheduleKeys = keyof typeof schedule;
export default schedule;


