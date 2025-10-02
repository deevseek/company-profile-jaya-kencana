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

const sanitizeListItem = (text) =>
  text
    .replace(/^[\s•\u2022\-]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

const extractRepeatedKeywordItems = (text) => {
  if (!text) {
    return [];
  }

  const wordMatches = text.match(/\b([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ0-9/&-]{2,})\b/g);
  if (!wordMatches) {
    return [];
  }

  const frequencyMap = wordMatches.reduce((acc, word) => {
    const normalized = word.toLowerCase();
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});

  const repeatedEntry = Object.entries(frequencyMap)
    .filter(([keyword, count]) => count >= 3 && keyword.length > 3 && !['pelayanan', 'perusahaan', 'dengan'].includes(keyword))
    .sort((a, b) => b[1] - a[1])[0];

  if (!repeatedEntry) {
    return [];
  }

  const [keyword] = repeatedEntry;
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keywordRegex = new RegExp(`(?=${escapedKeyword}\\b)`, 'gi');
  const leadingKeywordRegex = new RegExp(`^${escapedKeyword}`, 'i');
  const trailingKeywordRegex = new RegExp(`\\s+${escapedKeyword}$`, 'i');

  const items = text
    .split(keywordRegex)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const normalized = segment.replace(leadingKeywordRegex, (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase());
      const ensuredPrefix = leadingKeywordRegex.test(segment)
        ? normalized
        : `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${segment}`;

      return sanitizeListItem(ensuredPrefix.replace(trailingKeywordRegex, ''));
    })
    .filter(Boolean);

  return items.length >= 3 ? [...new Set(items)] : [];
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
        .split(/(?:\r?\n|,|;|\u2022|•|\s+-\s+)/)
        .map(sanitizeListItem)
        .filter(Boolean);

      if (splitted.length > 1) {
        services = splitted;
      } else if (splitted.length === 1) {
        const keywordItems = extractRepeatedKeywordItems(splitted[0]);
        if (keywordItems.length > 0) {
          services = keywordItems;
          const firstItemIndex = splitted[0].indexOf(keywordItems[0]);
          const descriptionCandidate = firstItemIndex > 0 ? splitted[0].slice(0, firstItemIndex).trim() : '';
          extraDescription = descriptionCandidate || (firstItemIndex === -1 ? splitted[0] : '');
        } else {
          extraDescription = splitted[0];
        }
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
