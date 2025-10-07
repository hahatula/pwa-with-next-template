import React from 'react';
import styles from './Loader.module.css';

type LoaderProps = {
    size?: number;
    color?: string;
    center?: boolean | 'screen' | 'parent';
    className?: string;
};

//Usage:
//Center in parent: <Loader center />
//Fullscreen center: <Loader center="screen" />
//Custom size/color: <Loader size={10} color="#fff" />

export default function Loader({ size = 8, color = 'var(--accent)', center = false, className }: LoaderProps) {
    const style = { ['--dot-size' as unknown as string]: `${size}px`, color } as React.CSSProperties;

    const wrapperClassName = [
        typeof center === 'string' ? (center === 'screen' ? styles.fullscreen : styles.center) : (center ? styles.center : undefined),
        className
    ].filter(Boolean).join(' ');

    const content = (
        <div className={styles.loader} style={style} role="status" aria-label="Loading">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
        </div>
    );

    if (center) {
        return <div className={wrapperClassName}>{content}</div>;
    }
    return content;
}