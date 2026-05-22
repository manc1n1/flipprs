import styles from './Logo.module.css';

import { useLocation } from 'react-router-dom';

import Flippers from '@/assets/images/flippers.png';
import DarkFlippers from '@/assets/images/dark_flippers.png';

const Logo = () => {
  const { pathname } = useLocation();
  const showWebsiteName = pathname === '/';

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
      {showWebsiteName && <div className={styles.name}>flipp.rs</div>}
    </div>
  );
};

export default Logo;
