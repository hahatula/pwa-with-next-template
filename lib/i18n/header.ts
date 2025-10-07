const header = {
    address: {
        en: 'Ben Shemen St 4, 3rd floor\nTel Aviv-Yafo',
        he: 'בן שמן 4, קומה 3\nתל אביב-יפו'
    }
} as const;

export type HeaderKeys = keyof typeof header;
export default header;


