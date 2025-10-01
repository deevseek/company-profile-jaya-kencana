import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './AdminSidebar.css';

const AdminSidebar = () => {
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
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        {profile?.heroImage ? (
          <img src={profile.heroImage} alt="Logo perusahaan" className="admin-sidebar__brand-logo" />
        ) : (
          <div className="admin-sidebar__brand-placeholder">CV</div>
        )}
        <div>
          <h2>{profile?.companyName || 'Panel Admin'}</h2>
          <p>Kelola aset digital perusahaan</p>
        </div>
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
