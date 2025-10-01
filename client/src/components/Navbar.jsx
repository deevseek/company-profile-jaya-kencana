import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const originalOverflowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/company-profiles');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch company profile', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const { style } = document.body;

    if (originalOverflowRef.current === null) {
      originalOverflowRef.current = style.overflow;
    }

    if (isMenuOpen) {
      style.overflow = 'hidden';
    } else {
      style.overflow = originalOverflowRef.current || '';
    }

    return () => {
      style.overflow = originalOverflowRef.current || '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          {profile?.heroImage ? (
            <img
              src={profile.heroImage}
              alt={profile.companyName || 'Logo perusahaan'}
              className="navbar__brand-logo"
            />
          ) : (
            <div className="navbar__brand-placeholder">CV</div>
          )}
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">{profile?.companyName || 'CV. Jaya Kencana'}</span>
            <span className="navbar__brand-tagline">Solusi konstruksi & pengadaan profesional</span>
          </div>
        </div>
        <button
          type="button"
          className={`navbar__menu-toggle${isMenuOpen ? ' is-open' : ''}`}
          aria-label={isMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="navbar__links">
          <NavLink to="/" end onClick={closeMenu}>
            Beranda
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            Tentang
          </NavLink>
          <NavLink to="/products" onClick={closeMenu}>
            Produk
          </NavLink>
          <NavLink to="/portfolio" onClick={closeMenu}>
            Portofolio
          </NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>
            Galeri
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Kontak
          </NavLink>
        </nav>
      </div>
      <nav
        className={`navbar__links navbar__links--mobile${isMenuOpen ? ' navbar__links--open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <NavLink to="/" end onClick={closeMenu}>
          Beranda
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          Tentang
        </NavLink>
        <NavLink to="/products" onClick={closeMenu}>
          Produk
        </NavLink>
        <NavLink to="/portfolio" onClick={closeMenu}>
          Portofolio
        </NavLink>
        <NavLink to="/gallery" onClick={closeMenu}>
          Galeri
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Kontak
        </NavLink>
      </nav>
      {isMenuOpen && <div className="navbar__backdrop" onClick={closeMenu} role="presentation" />}
    </header>
  );
};

export default Navbar;
