"use client";
import Image from "next/image";
import styles from "./not-found.module.css";
import Header from "@/components/Header";
import AppButton from "@/components/AppButton";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthProvider";

export default function NotFound() {
    const { user } = useAuth();
    const { t } = useI18n('notFound');

    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.errorCode}>404</div>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.description}>{t('description')}</p>

                    <div className={styles.actions}>
                        {user ? (
                            <AppButton variant="primary" href="/schedule">
                                {t('goToSchedule')}
                            </AppButton>
                        ) : (
                            <AppButton variant="primary" href="/">
                                {t('goHome')}
                            </AppButton>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

