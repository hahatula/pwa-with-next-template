const home = {
    title: {
        en: 'Pitbull team\ntraining schedule',
        he: 'לוח אימונים\nקבוצת פיטבול'
    },
    description: {
        en: "Roy Nieman's BJJ Club",
        he: 'מועדון ג’יו ג’יטסו ברזילאי של רועי נימן'
    },
    installPrompt: {
        en: "We recommend installing the app on your home screen for easy access",
        he: 'אנו ממליצים להתקין את האפליקציה במסך הבית שלך כדי להקל על הגישה אליה'
    },
    installButton: {
        en: "Install App",
        he: 'התקן את האפליקציה'
    },
    installInstructionIOS: {
        en: "To install: open in Safari → Share → Add to Home Screen",
        he: 'כדי להתקין: פתח בסיפור בפית ← שתפ ← הוסף למסך הבית'
    },
    installInstructionInAppBrowser: {
        en: "Open in the browser outside the current app: Menu (⋮/…) → Open in browser",
        he: 'פתח בדפדפן מחוץ לאפליקציה הנוכחית: תפריט (⋮/…) ← פתח בדפדפן'
    }
} as const;

export type HomeKeys = keyof typeof home;
export default home;
