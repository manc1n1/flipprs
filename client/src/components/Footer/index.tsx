import styles from './Footer.module.css';

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons';
import { Heart, Skull } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import Flippers from '@/assets/images/flippers.png';
import DarkFlippers from '@/assets/images/dark_flippers.png';

type FooterLink = {
  title: string;
  href: string;
  icon?: ReactNode;
};

type FooterSection = {
  label: string;
  links: FooterLink[];
};

const footerLinks: FooterSection[] = [
  {
    label: 'Tools',
    links: [
      { title: 'Favourites', href: 'favourites', icon: <Heart /> },
      { title: `Death's Coffer`, href: 'deaths-coffer', icon: <Skull /> },
    ],
  },
  {
    label: 'Community',
    links: [
      {
        title: 'Discord',
        href: 'https://discord.gg/geuddJ5Htf',
        icon: <SiDiscord />,
      },
    ],
  },
  {
    label: 'Contact',
    links: [
      {
        title: 'GitHub',
        href: 'https://github.com/manc1n1/flipprs',
        icon: <SiGithub />,
      },
    ],
  },
];

function Footer() {
  const handleFooterNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <AnimatedContainer>
          <Link
            className={styles.brand}
            to='/'
            onClick={handleFooterNavClick}
          >
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
            flipp.rs
          </Link>
        </AnimatedContainer>

        <div className={styles.content}>
          <AnimatedContainer className={styles.disclaimerContainer}>
            <p className={styles.disclaimer}>
              Live exchange data on this site is provided by the&nbsp;
              <a
                href='https://oldschool.runescape.wiki'
                target='_blank'
                rel='noreferrer noopener'
              >
                Old School RuneScape Wiki
              </a>
              &nbsp;and&nbsp;
              <a
                href='https://runelite.net'
                target='_blank'
                rel='noreferrer noopener'
              >
                RuneLite
              </a>
              . This website is independently operated and is not endorsed,
              maintained, or affiliated with Jagex Limited, the trademark holder
              of 'RuneScape' and 'OSRS'.
            </p>
          </AnimatedContainer>
          <div className={styles.linksGrid}>
            {footerLinks.map((section, index) => (
              <AnimatedContainer
                key={section.label}
                delay={0.1 + index * 0.1}
              >
                <h3 className={styles.sectionTitle}>{section.label}</h3>
                <ul className={styles.linkList}>
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        className={styles.link}
                        to={link.href}
                        onClick={handleFooterNavClick}
                      >
                        {link.icon}
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} flipp.rs</p>
      </div>
    </footer>
  );
}

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ filter: 'blur(4px)', y: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export default Footer;
