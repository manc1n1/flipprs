import styles from './Header.module.css';

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Squeeze as Hamburger } from 'hamburger-react';
import { motion } from 'framer-motion';
import { Heart, Skull } from 'lucide-react';

import { Autocomplete } from '@/components/Autocomplete';
import Logo from '@/components/Logo';
import WikiImage from '@/components/WikiImage';

import { useItemsQuery } from '@/hooks/useItemsQuery';
import { useHaptics } from '@/hooks/useHaptics';

import type { TSearchItem } from '@/types/item';

const AUTOCOMPLETE_SCROLL_THRESHOLD = 150;

const Header = () => {
  const { selection } = useHaptics();
  const [isOpen, setOpen] = useState(false);
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] =
    useState(false);
  const [isAutocompleteFocused, setIsAutocompleteFocused] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const showAutocomplete =
    !isHomePage || hasScrolledPastThreshold || isAutocompleteFocused;
  const { data: items = [] } = useItemsQuery();
  const headerRef = useRef<HTMLElement | null>(null);
  const autocompleteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isHomePage) {
      setHasScrolledPastThreshold(false);
      return;
    }

    const handleScroll = () => {
      setHasScrolledPastThreshold(
        window.scrollY >= AUTOCOMPLETE_SCROLL_THRESHOLD,
      );
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (!headerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToTopWithHaptic = () => {
    selection();
    requestAnimationFrame(() => {
      scrollToTop();
    });
  };

  const toggleMobileMenu = () => {
    setOpen(!isOpen);
    scrollToTop();
  };

  const handleSelect = (item: TSearchItem) => {
    autocompleteRef.current?.blur();
    setIsAutocompleteFocused(false);
    navigate(`/item/${item.id}`);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
    >
      <div className={styles.container}>
        <div
          data-clickfx='link'
          className={styles.hamburger}
        >
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            onToggle={selection}
            size={25}
            duration={0.2}
            rounded
            hideOutline={false}
            label='Show menu'
          />
        </div>
        <Link
          className={styles.brand}
          to='/'
          onClick={scrollToTopWithHaptic}
        >
          <Logo />
        </Link>
        <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
          <Link
            className={styles.link}
            to='/favourites'
            onClick={toggleMobileMenu}
          >
            <motion.button
              className={styles.navItem}
              type='button'
              onClick={selection}
              whileTap={{ scale: 0.99 }}
            >
              <Heart
                className={styles.heartIcon}
                size={22}
              />
              <span className={styles.navItemLabel}>Favourites</span>
            </motion.button>
          </Link>
          <Link
            className={styles.link}
            to='/deaths-coffer'
            onClick={toggleMobileMenu}
          >
            <motion.button
              className={styles.navItem}
              type='button'
              onClick={selection}
              whileTap={{ scale: 0.99 }}
            >
              <Skull size={22} />
              <span className={styles.navItemLabel}>Death's Coffer</span>
            </motion.button>
          </Link>
        </nav>
      </div>
      {showAutocomplete && (
        <motion.div
          className={styles.autocompleteContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onFocusCapture={() => setIsAutocompleteFocused(true)}
          onBlurCapture={() => setIsAutocompleteFocused(false)}
        >
          <Autocomplete
            ref={autocompleteRef}
            options={items}
            onSelect={handleSelect}
            getOptionLabel={(item: TSearchItem) => item.name}
            renderOption={(item: TSearchItem) => (
              <div className={styles.option}>
                <div className={styles.imgContainer}>
                  <WikiImage
                    icon={item.icon}
                    alt={item.name}
                  />
                </div>
                {item.name}
              </div>
            )}
          />
        </motion.div>
      )}
    </header>
  );
};

export default Header;
