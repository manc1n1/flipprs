import styles from './Spinner.module.css';

function Spinner({ size }: { size?: number | string }) {
  const sizeStyle = typeof size === 'number' ? `${size}px` : size;
  const style: React.CSSProperties = {
    width: sizeStyle,
    height: sizeStyle,
  };

  return (
    <div
      className={styles.spinner}
      style={style}
      role='status'
      aria-live='polite'
      aria-label='Loading'
    />
  );
}

export default Spinner;
