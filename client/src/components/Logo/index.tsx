import styles from './Logo.module.css';

import Flippers from '@/assets/images/flippers.png';
import DarkFlippers from '@/assets/images/dark_flippers.png';

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <picture className={styles.logo}>
        <source
          srcSet={Flippers}
          media='(prefers-color-scheme: light)'
        />
        <source
          srcSet={DarkFlippers}
          media='(prefers-color-scheme: dark)'
        />
        <img
          src={Flippers}
          alt='Logo'
        />
      </picture>
      <div className={styles.name}>flipp.rs</div>
    </div>
  );
};

export default Logo;
