import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', labelKey: 'home' },
  { to: '/about', labelKey: 'about_us' },
  { to: '/help', labelKey: 'help_faqs' },
  { to: '/how-it-works', labelKey: 'how_it_works' },
  { to: '/contact', labelKey: 'contact_us' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__accent" aria-hidden="true" />

      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
          <img src={logo} alt="iVotePK" />
        </Link>

        <button
          type="button"
          className="site-header__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className={`bi bi-${menuOpen ? 'x-lg' : 'list'}`} />
        </button>

        <div className={`site-header__panel ${menuOpen ? 'is-open' : ''}`}>
          <nav className="site-header__nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`site-header__nav-link ${
                  location.pathname === item.to ? 'site-header__nav-link--active' : ''
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="site-header__lang">
            <button
              type="button"
              className={`site-header__lang-btn ${
                i18n.language === 'en' ? 'site-header__lang-btn--active' : ''
              }`}
              onClick={() => setLanguage('en')}
            >
              🇬🇧 EN
            </button>
            <button
              type="button"
              className={`site-header__lang-btn site-header__lang-btn--ur ${
                i18n.language === 'ur' ? 'site-header__lang-btn--active' : ''
              }`}
              onClick={() => setLanguage('ur')}
            >
              🇵🇰 اردو
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
