import { useEffect, useState } from 'react';
import axios from 'axios';

const Footer = () => {
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
        console.error('Failed to load footer contact information', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div>
            <h3>{profile?.companyName || 'CV. Jaya Kencana'}</h3>
            <p>
              {profile?.about ||
                'Solusi profesional untuk konstruksi dan pengadaan industri. Kami siap mendukung keberhasilan proyek Anda.'}
            </p>
          </div>
          <div>
            <h4>Kontak</h4>
            <p>{profile?.address || 'Alamat perusahaan belum tersedia.'}</p>
            <p>{profile?.phone || 'Nomor telepon belum tersedia.'}</p>
            <p>{profile?.email || 'Email belum tersedia.'}</p>
          </div>
          <div>
            <h4>Jam Operasional</h4>
            <p>Senin - Jumat: 08.00 - 17.00</p>
            <p>Sabtu: 08.00 - 13.00</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {profile?.companyName || 'CV. Jaya Kencana'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
