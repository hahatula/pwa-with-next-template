import AppButton from "../AppButton";
import styles from "./Header.module.css";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import Menu from "../Menu";

export default function Header() {
    const { user } = useAuth();
    const { lang, toggleLanguage } = useLanguage();
    const { t } = useI18n('header');
    const nextLabel = lang === 'en' ? 'HE' : 'EN';

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <AppButton variant="gradient" onClick={() => { toggleLanguage(); }}>{nextLabel}</AppButton>
                <a className={styles.address} href="https://maps.app.goo.gl/rAmVwWSrMZuPG7mG6" target="_blank">
                    {t('address').split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            {i === 0 && <br />}
                        </span>
                    ))}
                </a>
            </div>
            {user && <AppButton variant="gradient" onClick={() => {
                setIsMenuOpen(!isMenuOpen);
            }}><Image src="/menu.svg" alt="Menu" width={20} height={20} /></AppButton>}
            {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)}/>}
        </header>
    );
}
