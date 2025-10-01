import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/company-profiles');
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch company profile', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <main>
      <section className="hero section" style={{ paddingTop: '6rem', background: '#0f172a' }}>
        <div className="container" style={{ color: '#e2e8f0', display: 'grid', gap: '2rem', alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff' }}>
              Solusi Profesional untuk Proyek Konstruksi Anda
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              {profile?.about ||
                'CV. Jaya Kencana menghadirkan layanan konstruksi dan pengadaan industri dengan mengutamakan kualitas, keamanan, dan inovasi.'}
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Link to="/contact" className="primary-button">
                Konsultasi Gratis
              </Link>
              <Link to="/portfolio" className="primary-button" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(148, 163, 184, 0.4)' }}>
                Lihat Portofolio
              </Link>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(14,165,233,0.2))', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ color: '#bae6fd' }}>Mengapa Memilih Kami?</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'grid', gap: '1rem' }}>
              <li>✅ Tim profesional berpengalaman</li>
              <li>✅ Standar keamanan dan kualitas tinggi</li>
              <li>✅ Dukungan end-to-end untuk setiap proyek</li>
              <li>✅ Jaringan supplier industri yang luas</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Layanan Unggulan</h2>
          <div className="card-grid">
            <div className="card">
              <h3>Perencanaan & Konsultasi</h3>
              <p>Kami membantu Anda merancang proyek secara komprehensif dari awal hingga implementasi.</p>
            </div>
            <div className="card">
              <h3>Konstruksi</h3>
              <p>Eksekusi proyek konstruksi dengan standar keselamatan dan kualitas yang tinggi.</p>
            </div>
            <div className="card">
              <h3>Pengadaan Barang</h3>
              <p>Penyediaan material dan peralatan industri terpercaya untuk mendukung kelancaran proyek.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
