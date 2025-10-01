import { useEffect, useState } from 'react';
import axios from 'axios';

const buildWhatsAppLink = (rawPhone) => {
  if (!rawPhone) {
    return null;
  }

  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }

  return `https://wa.me/${digitsOnly}`;
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const whatsappLink = buildWhatsAppLink(profile?.phone);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/company-profiles');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error('Failed to load company profile for contact page', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('/api/messages', form);
      setStatus({ type: 'success', message: 'Pesan berhasil dikirim. Kami akan menghubungi Anda segera.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div>
          <h1 className="section-title" style={{ textAlign: 'left' }}>
            Hubungi Kami
          </h1>
          <p style={{ lineHeight: 1.7 }}>
            Kami siap membantu kebutuhan proyek Anda. Silakan isi formulir berikut atau hubungi kami melalui informasi kontak
            yang tersedia.
          </p>
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3>Informasi Kontak</h3>
            <p>Alamat: {profile?.address || 'Informasi alamat belum tersedia.'}</p>
            <p>Telepon: {profile?.phone || 'Informasi telepon belum tersedia.'}</p>
            <p>Email: {profile?.email || 'Informasi email belum tersedia.'}</p>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
                style={{ display: 'inline-block', marginTop: '1rem' }}
              >
                Hubungi via WhatsApp
              </a>
            ) : (
              <p>WhatsApp: Informasi nomor WhatsApp belum tersedia.</p>
            )}
          </div>
        </div>

        <div className="card" style={{ background: '#fff' }}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nama Lengkap</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="subject">Subjek</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="message">Pesan</label>
              <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required />
            </div>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
            {status && (
              <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
