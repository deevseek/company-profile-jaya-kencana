import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ token, setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <main className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="card" style={{ background: '#fff' }}>
            <h1 style={{ textAlign: 'center' }}>Login Admin</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="password">Kata Sandi</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              {status && (
                <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626', textAlign: 'center' }}>{status.message}</p>
              )}
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-content" style={{ display: 'grid', gap: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Selamat Datang</h1>
            <p>Kelola konten website CV. Jaya Kencana melalui panel admin.</p>
          </div>
          <button className="primary-button" onClick={handleLogout}>
            Keluar
          </button>
        </header>

        <section className="card-grid">
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

const AdminCard = ({ title, description, link }) => (
  <div className="card" style={{ background: '#fff' }}>
    <h3>{title}</h3>
    <p>{description}</p>
    <Link className="primary-button" to={link} style={{ width: 'fit-content' }}>
      Kelola
    </Link>
  </div>
);

export default Dashboard;
