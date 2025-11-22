const notFound = {
    title: {
        en: '404 - Page Not Found',
        he: '404 - הדף לא נמצא'
    },
    description: {
        en: 'The page you are looking for does not exist or has been moved.',
        he: 'הדף שאתה מחפש לא קיים או הועבר.'
    },
    goHome: {
        en: 'Go to Home',
        he: 'חזור לדף הבית'
    },
    goToSchedule: {
        en: 'View Schedule',
        he: 'צפה בלוח'
    },
} as const;

export type NotFoundKeys = keyof typeof notFound;
export default notFound;

