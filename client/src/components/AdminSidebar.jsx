import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2>Admin Panel</h2>
        <p>CV. Jaya Kencana</p>
      </div>
      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/company-profile">Profil Perusahaan</NavLink>
        <NavLink to="/admin/products">Produk</NavLink>
        <NavLink to="/admin/projects">Proyek</NavLink>
        <NavLink to="/admin/gallery">Galeri</NavLink>
        <NavLink to="/admin/messages">Pesan</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
