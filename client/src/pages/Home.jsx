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
      <section className="hero section hero--home">
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="hero__eyebrow">{profile?.companyName || 'CV. Jaya Kencana'}</span>
            <h1>Solusi Profesional untuk Proyek Konstruksi Anda</h1>
            <p>
              {profile?.about ||
                'CV. Jaya Kencana menghadirkan layanan konstruksi dan pengadaan industri dengan mengutamakan kualitas, keamanan, dan inovasi.'}
            </p>
            <div className="hero__cta">
              <Link to="/contact" className="primary-button">
                Konsultasi Gratis
              </Link>
              <Link to="/portfolio" className="primary-button hero__cta-secondary">
                Lihat Portofolio
              </Link>
            </div>
            <div className="hero__meta">
              <span>Didukung oleh tim ahli sejak {profile?.yearFounded || '2001'}</span>
              <span>Respon cepat & pendampingan penuh</span>
            </div>
            {(profile?.phone || profile?.email || profile?.address) && (
              <div className="hero__contact-card">
                <span className="hero__contact-heading">Butuh bantuan cepat?</span>
                <p>Hubungi tim kami secara langsung melalui:</p>
                <div className="hero__contact-list">
                  {profile?.phone && (
                    <a
                      href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                      className="hero__contact-item"
                    >
                      <span role="img" aria-hidden="true">
                        📞
                      </span>
                      <span>{profile.phone}</span>
                    </a>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="hero__contact-item">
                      <span role="img" aria-hidden="true">
                        ✉️
                      </span>
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.address && (
                    <div className="hero__contact-item hero__contact-item--static">
                      <span role="img" aria-hidden="true">
                        📍
                      </span>
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hero__visual">
            {profile?.heroImage && (
              <div className="hero__logo-card">
                <img src={profile.heroImage} alt="Logo CV. Jaya Kencana" />
                <p>Logo resmi perusahaan</p>
              </div>
            )}
            <div className="hero__highlights">
              <h3>Mengapa Memilih Kami?</h3>
              <ul>
                <li>✅ Tim profesional berpengalaman</li>
                <li>✅ Standar keamanan dan kualitas tinggi</li>
                <li>✅ Dukungan end-to-end untuk setiap proyek</li>
                <li>✅ Jaringan supplier industri yang luas</li>
              </ul>
            </div>
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
