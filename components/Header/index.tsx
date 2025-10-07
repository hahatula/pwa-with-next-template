import PitButton from "../PitButton";
import styles from "./Header.module.css";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/lib/i18n";

export default function Header() {
    const { user } = useAuth();
    const { lang, toggleLanguage } = useLanguage();
    const { t } = useI18n('header');
    const nextLabel = lang === 'en' ? 'HE' : 'EN';

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <PitButton variant="gradient" onClick={() => { toggleLanguage(); }}>{nextLabel}</PitButton>
                <a className={styles.address} href="https://maps.app.goo.gl/rAmVwWSrMZuPG7mG6" target="_blank">
                    {t('address').split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            {i === 0 && <br />}
                        </span>
                    ))}
                </a>
            </div>
            {user && <PitButton variant="gradient" onClick={() => {
                console.log('menu clicked');
            }}><Image src="/menu.svg" alt="Menu" width={20} height={20} /></PitButton>}
        </header>
    );
}
