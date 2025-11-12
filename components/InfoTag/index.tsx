import styles from './InfoTag.module.css';
import { useLanguage } from '@/contexts/LanguageProvider';

type InfoTagProps = {
    icon: React.ReactNode;
    label: string;
};

export default function InfoTag({ icon, label }: InfoTagProps) {
    const { lang } = useLanguage();
    
    return (
        <div className={`${styles.infoTag} ${lang === 'he' ? styles.reverse : ''}`}>
            {icon}
            <span>{label}</span>
        </div>
    );
}