import styles from '../ItemMetrics.module.css';

export function Volume({ volume }: { volume: number | null }) {
  return (
    <div className={volume === 0 ? styles.bold : ''}>
      {volume !== null && volume > 0 ? volume.toLocaleString() : '-'}
    </div>
  );
}
