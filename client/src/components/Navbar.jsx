import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo">CV. Jaya Kencana</div>
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
