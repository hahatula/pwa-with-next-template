import styles from './PitInput.module.css';

export default function PitInput({ placeholder, value, onChange, type, name }: { placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, name?: string }) {
    return <input className={styles.pitInput} placeholder={placeholder} value={value} onChange={onChange} type={type} name={name} />;
}