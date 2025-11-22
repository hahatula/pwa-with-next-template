import styles from './ActionFooter.module.css';

type ActionFooterProps = {
    children: React.ReactNode;
};

export default function ActionFooter({ children, direction }: ActionFooterProps & { direction?: 'row' | 'column' }) {
    return <footer className={`${styles.ctasWrapper} ${direction ? styles[direction] : ''}`}>{children}</footer>;
}