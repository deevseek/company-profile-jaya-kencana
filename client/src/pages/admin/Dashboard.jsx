import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar';

const Dashboard = ({ token, setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ products: 0, projects: 0, gallery: 0, messages: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/company-profiles');
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const authConfig = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [productsRes, projectsRes, galleryRes, messagesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/projects'),
          axios.get('/api/gallery'),
          axios.get('/api/messages', authConfig)
        ]);

        setStats({
          products: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
          projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
          gallery: Array.isArray(galleryRes.data) ? galleryRes.data.length : 0,
          messages: Array.isArray(messagesRes.data) ? messagesRes.data.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        setStatsError('Tidak dapat memuat ringkasan data.');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      setToken(data.token);
      setStatus({ type: 'success', message: 'Login berhasil.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Email atau kata sandi salah.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__panel">
          <div className="admin-auth__panel-inner">
            <div className="admin-auth__brand">
              {profile?.heroImage ? (
                <img src={profile.heroImage} alt="Logo perusahaan" />
              ) : (
                <div className="admin-auth__brand-placeholder">CV</div>
              )}
              <div>
                <h1>{profile?.companyName || 'CV. Jaya Kencana'}</h1>
                <p>Panel administrasi untuk mengelola konten website perusahaan.</p>
              </div>
            </div>
            <ul className="admin-auth__features">
              <li>✅ Kelola profil perusahaan secara real-time</li>
              <li>✅ Perbarui produk, proyek, dan galeri dengan mudah</li>
              <li>✅ Pantau pesan masuk dari calon pelanggan</li>
            </ul>
          </div>
        </div>
        <div className="admin-auth__form">
          <div className="admin-auth__form-card">
            <h2>Masuk ke Dashboard Admin</h2>
            <p>Gunakan kredensial resmi untuk mengakses panel pengelolaan.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="password">Kata Sandi</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="primary-button admin-auth__submit" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              {status && <div className={`admin-alert admin-alert--${status.type}`}>{status.message}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <p className="admin-dashboard__welcome">Halo, Administrator</p>
            <h1>{profile?.companyName || 'Panel Admin CV. Jaya Kencana'}</h1>
            <p className="admin-dashboard__subtitle">Kelola konten website dan pantau aktivitas terbaru.</p>
          </div>
          <button className="primary-button admin-dashboard__logout" onClick={handleLogout}>
            Keluar
          </button>
        </header>

        <section className="admin-dashboard__stats">
          <StatCard title="Produk" value={stats.products} loading={statsLoading} to="/admin/products" />
          <StatCard title="Proyek" value={stats.projects} loading={statsLoading} to="/admin/projects" />
          <StatCard title="Galeri" value={stats.gallery} loading={statsLoading} to="/admin/gallery" />
          <StatCard title="Pesan" value={stats.messages} loading={statsLoading} to="/admin/messages" highlight />
        </section>

        {statsError && <div className="admin-alert admin-alert--error">{statsError}</div>}

        <section className="admin-dashboard__cards">
          <AdminCard title="Profil Perusahaan" description="Perbarui data profil perusahaan." link="/admin/company-profile" />
          <AdminCard title="Produk" description="Kelola daftar produk perusahaan." link="/admin/products" />
          <AdminCard title="Proyek" description="Kelola portofolio proyek." link="/admin/projects" />
          <AdminCard title="Galeri" description="Perbarui foto-foto proyek." link="/admin/gallery" />
          <AdminCard title="Pesan" description="Tinjau pesan masuk dari pengunjung." link="/admin/messages" />
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, loading, to, highlight = false }) => (
  <Link to={to} className={`stat-card${highlight ? ' stat-card--highlight' : ''}`}>
    <div>
      <p>{title}</p>
      <h2>{loading ? '...' : value}</h2>
    </div>
    <span>Lihat detail</span>
  </Link>
);

const AdminCard = ({ title, description, link }) => (
  <div className="admin-dashboard__card">
    <h3>{title}</h3>
    <p>{description}</p>
    <Link className="admin-dashboard__card-link" to={link}>
      Kelola ➜
    </Link>
  </div>
);

export default Dashboard;
