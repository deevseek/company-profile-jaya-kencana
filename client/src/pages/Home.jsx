import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [profileResponse, galleryResponse] = await Promise.all([
          axios.get('/api/company-profiles'),
          axios.get('/api/gallery')
        ]);

        const profileData = profileResponse.data;
        if (Array.isArray(profileData) && profileData.length > 0) {
          setProfile(profileData[0]);
        }

        const galleryItems = galleryResponse.data;
        if (Array.isArray(galleryItems)) {
          const formattedImages = galleryItems
            .filter((item) => item.imageUrl)
            .map((item, index) => ({
              id: item.id ?? index,
              url: item.imageUrl,
              title: item.title || `Dokumentasi Proyek ${index + 1}`
            }));

          if (formattedImages.length > 0) {
            setGalleryImages(formattedImages);
            setBackgroundImage(formattedImages[0].url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch home data', error);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (galleryImages.length < 2) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [galleryImages.length]);

  return (
    <main>
      <section
        className="hero section hero--home"
        style={
          backgroundImage
            ? {
                '--hero-background-image': `url(${backgroundImage})`,
                '--hero-background-opacity': 0.45
              }
            : undefined
        }
      >
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
            {(galleryImages.length > 0 || profile?.heroImage) && (
              <div className="hero__gallery" role="group" aria-label="Galeri proyek terbaru">
                <div className="hero__gallery-frame">
                  <img
                    src={
                      galleryImages.length > 0
                        ? galleryImages[currentSlide]?.url
                        : profile?.heroImage
                    }
                    alt={
                      galleryImages.length > 0
                        ? galleryImages[currentSlide]?.title
                        : 'Dokumentasi proyek CV. Jaya Kencana'
                    }
                  />
                </div>
                {(galleryImages.length > 0 && galleryImages[currentSlide]?.title) ||
                profile?.companyName ? (
                  <p className="hero__gallery-caption">
                    {galleryImages.length > 0
                      ? galleryImages[currentSlide]?.title
                      : `Profil ${profile?.companyName || 'CV. Jaya Kencana'}`}
                  </p>
                ) : null}
                {galleryImages.length > 1 && (
                  <div className="hero__gallery-dots" role="tablist" aria-label="Pilih foto galeri">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image.id || index}
                        type="button"
                        className={`hero__gallery-dot${
                          index === currentSlide ? ' hero__gallery-dot--active' : ''
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Lihat foto ${index + 1}`}
                        aria-selected={index === currentSlide}
                      />
                    ))}
                  </div>
                )}
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
