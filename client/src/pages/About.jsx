import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const DEFAULT_ABOUT_CONTENT = {
  introParagraphs: [
    'Sejak tahun 2001, CV. Jaya Kencana berkomitmen menghadirkan solusi konstruksi dan pengadaan industri terbaik di Indonesia.'
  ],
  serviceHeading: '',
  serviceDescription: '',
  services: []
};

const formatAboutContent = (aboutText) => {
  if (!aboutText || typeof aboutText !== 'string') {
    return DEFAULT_ABOUT_CONTENT;
  }

  const normalized = aboutText.replace(/\r\n/g, '\n').trim();

  const serviceMatch = normalized.match(/Pelayanan kami[^:]*:/i);
  let introText = normalized;
  let serviceText = '';

  if (serviceMatch) {
    introText = normalized.slice(0, serviceMatch.index).trim();
    serviceText = normalized.slice(serviceMatch.index + serviceMatch[0].length).trim();
  }

  const introParagraphs = introText
    .split(/\n+/)
    .flatMap((block) => block.split(/(?<=\.)\s+(?=[A-Z0-9])/))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let services = [];
  let extraDescription = '';

  if (serviceText) {
    if (/\d+\./.test(serviceText)) {
      const enumeratedParts = serviceText.split(/\d+\.\s*/);
      const cleanedEnumerated = enumeratedParts
        .map((item) => item.replace(/^[,;\s-]+/, '').trim())
        .filter(Boolean);

      services = [...cleanedEnumerated];
    }

    if (services.length === 0) {
      const splitted = serviceText
        .split(/(?:\r?\n|,)/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (splitted.length > 1) {
        services = splitted;
      } else if (splitted.length === 1) {
        extraDescription = splitted[0];
      }
    }
  }

  const serviceHeading = serviceMatch ? 'Pelayanan Kami' : services.length > 0 ? 'Pelayanan Kami' : '';
  const serviceDescription = serviceMatch
    ? serviceMatch[0]
        .replace(/Pelayanan kami\s*,?/i, '')
        .replace(/berupa:\s*$/i, '')
        .replace(/:\s*$/, '')
        .trim()
    : '';

  const combinedServiceDescription = [serviceDescription, extraDescription].filter(Boolean).join(' ');

  return {
    introParagraphs: introParagraphs.length > 0 ? introParagraphs : [normalized],
    serviceHeading,
    serviceDescription: combinedServiceDescription,
    services
  };
};

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

  const formattedAbout = useMemo(() => formatAboutContent(profile?.about), [profile?.about]);

  return (
    <main className="section">
      <div className="container" style={{ display: 'grid', gap: '3rem' }}>
        <header>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            Tentang CV. Jaya Kencana
          </h1>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              textAlign: 'left',
              maxWidth: '820px',
              margin: '0 auto',
              lineHeight: 1.7
            }}
          >
            {formattedAbout.introParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </header>

        {(formattedAbout.serviceHeading || formattedAbout.serviceDescription || formattedAbout.services.length > 0) && (
          <section className="card" style={{ background: '#fff', display: 'grid', gap: '1.25rem' }}>
            {formattedAbout.serviceHeading && <h3>{formattedAbout.serviceHeading}</h3>}
            {formattedAbout.serviceDescription && <p style={{ lineHeight: 1.7 }}>{formattedAbout.serviceDescription}</p>}
            {formattedAbout.services.length > 0 && (
              <ul style={{ display: 'grid', gap: '0.5rem', paddingLeft: '1.25rem', margin: 0, lineHeight: 1.7 }}>
                {formattedAbout.services.map((service) => (
                  <li key={service}>{service.replace(/\.$/, '')}</li>
                ))}
              </ul>
            )}
          </section>
        )}

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

        <section className="card" style={{ background: '#fff' }}>
          <h3>Legalitas Perusahaan</h3>
          {Array.isArray(profile?.legalDocument) && profile.legalDocument.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <p>Dokumen legalitas resmi kami tersedia untuk diunduh.</p>
              <ul style={{ display: 'grid', gap: '0.5rem', paddingLeft: '1.25rem', margin: 0 }}>
                {profile.legalDocument.map((documentUrl, index) => (
                  <li key={documentUrl}>
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button"
                      style={{ justifySelf: 'flex-start' }}
                    >
                      Dokumen Legalitas {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Informasi legalitas perusahaan akan segera tersedia.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default About;
