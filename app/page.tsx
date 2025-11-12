"use client";
import styles from "./page.module.css";
import InstallPrompt from "@/components/InstallPrompt";
import AppButton from "@/components/AppButton";
import { useInstallPrompt } from '@/components/InstallPrompt/useInstallPrompt';
import Header from "@/components/Header";
import useIsHydrated from "@/hooks/useIsHydrated";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthProvider";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const { hasInstallUI } = useInstallPrompt();
  const hydrated = useIsHydrated();
  const showInstallUI = hydrated ? hasInstallUI : true;
  const { t: tHome } = useI18n('home');
  const { t: tCommon } = useI18n('common');

  if (user) {
    return redirect('/schedule');
  }

  const ctasClassName = [
    styles.ctas,
    !hasInstallUI && styles.noInstallPrompt,
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.page}>

      <Header />
      <main className={styles.main}>
        <>
          <div className={styles.title}>
            <h1 className={styles.heading}>
              {tHome('title').split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p className={styles.description}>{tHome('description')}</p>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.ctasWrapper}>
              <InstallPrompt />
              <div className={ctasClassName}>
                <AppButton variant="secondary" href="/register">{tCommon('signup')}</AppButton>
                <AppButton variant={showInstallUI ? "secondary" : "primary"} href="/login">{tCommon('login')}</AppButton>
              </div>
            </div>
          </div>
        </>
      </main>
    </div>
  );
}
