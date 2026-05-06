import styles from './Layout.module.css';

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = () => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      if ((!isMod && e.key === '/') || (isMod && e.key === 'k')) {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(
          'input[data-autocomplete-input]',
        );
        input?.focus();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <>
      <Header />
      <div className={styles.layoutContainer}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
