import { useEffect, useState } from 'react';
import axios from 'axios';

const About = () => {
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
    <main className="section">
      <div className="container" style={{ display: 'grid', gap: '3rem' }}>
        <header>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            Tentang CV. Jaya Kencana
          </h1>
          <p style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            {profile?.about ||
              'Sejak tahun 2001, CV. Jaya Kencana berkomitmen menghadirkan solusi konstruksi dan pengadaan industri terbaik di Indonesia.'}
          </p>
        </header>

        <section style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="card" style={{ background: '#1d4ed8', color: '#fff' }}>
            <h3>Sejarah</h3>
            <p>
              Didirikan pada {profile?.yearFounded || '2001'}, kami memulai sebagai penyedia jasa konstruksi lokal dan berkembang menjadi
              mitra strategis untuk proyek industri skala nasional.
            </p>
          </div>
          <div className="card">
            <h3>Visi</h3>
            <p>{profile?.vision || 'Menjadi perusahaan konstruksi dan pengadaan industri terpercaya di Asia Tenggara.'}</p>
          </div>
          <div className="card">
            <h3>Misi</h3>
            <p>
              {profile?.mission ||
                'Memberikan layanan berkualitas, menjaga keselamatan kerja, dan terus berinovasi demi kepuasan pelanggan.'}
            </p>
          </div>
        </section>

        <section className="card" style={{ background: '#fff' }}>
          <h3>Sertifikasi & Pengakuan</h3>
          <p>{profile?.certifications || 'ISO 9001, ISO 14001, OHSAS 18001'}</p>
        </section>
      </div>
    </main>
  );
};

export default About;
