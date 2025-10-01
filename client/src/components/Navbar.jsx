import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [profile, setProfile] = useState(null);

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
        <nav className="navbar__links">
          <NavLink to="/" end>
            Beranda
          </NavLink>
          <NavLink to="/about">Tentang</NavLink>
          <NavLink to="/products">Produk</NavLink>
          <NavLink to="/portfolio">Portofolio</NavLink>
          <NavLink to="/gallery">Galeri</NavLink>
          <NavLink to="/contact">Kontak</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
