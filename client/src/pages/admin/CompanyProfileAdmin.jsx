import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const CompanyProfileAdmin = ({ token }) => {
  const [profile, setProfile] = useState({
    companyName: '',
    about: '',
    vision: '',
    mission: '',
    address: '',
    phone: '',
    email: '',
    yearFounded: '',
    certifications: ''
  });
  const [heroImage, setHeroImage] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState('');
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const loadProfile = async () => {
    try {
      const { data } = await axios.get('/api/company-profiles');
      if (Array.isArray(data) && data.length > 0) {
        setProfile({
          companyName: data[0].companyName || '',
          about: data[0].about || '',
          vision: data[0].vision || '',
          mission: data[0].mission || '',
          address: data[0].address || '',
          phone: data[0].phone || '',
          email: data[0].email || '',
          yearFounded: data[0].yearFounded || '',
          certifications: data[0].certifications || ''
        });
        setCurrentHeroImage(data[0].heroImage || '');
        setHeroImage(null);
        setStatus(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => formData.append(key, value));
      if (heroImage) {
        formData.append('heroImage', heroImage);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const { data } = await axios.get('/api/company-profiles');
      if (Array.isArray(data) && data.length > 0) {
        await axios.put(`/api/company-profiles/${data[0].id}`, formData, config);
      } else {
        await axios.post('/api/company-profiles', formData, config);
      }
      setStatus({ type: 'success', message: 'Profil perusahaan berhasil disimpan.' });
      await loadProfile();
    } catch (error) {
      console.error('Failed to save profile', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  return (
    <div className="card" style={{ background: '#fff', display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Profil Perusahaan</h1>
          <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Perbarui identitas dan informasi utama perusahaan.</p>
        </div>
        {currentHeroImage && (
          <div className="image-preview" style={{ textAlign: 'center' }}>
            <img src={currentHeroImage} alt="Logo perusahaan" />
            <span>Logo saat ini</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Perusahaan</label>
          <input name="companyName" value={profile.companyName} onChange={handleChange} required />
        </div>
        <div>
          <label>Deskripsi</label>
          <textarea name="about" rows="4" value={profile.about} onChange={handleChange} required />
        </div>
        <div>
          <label>Visi</label>
          <textarea name="vision" rows="3" value={profile.vision} onChange={handleChange} />
        </div>
        <div>
          <label>Misi</label>
          <textarea name="mission" rows="3" value={profile.mission} onChange={handleChange} />
        </div>
        <div>
          <label>Alamat</label>
          <input name="address" value={profile.address} onChange={handleChange} />
        </div>
        <div>
          <label>Telepon</label>
          <input name="phone" value={profile.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={profile.email} onChange={handleChange} />
        </div>
        <div>
          <label>Tahun Berdiri</label>
          <input name="yearFounded" type="number" value={profile.yearFounded} onChange={handleChange} />
        </div>
        <div>
          <label>Sertifikasi</label>
          <textarea name="certifications" rows="3" value={profile.certifications} onChange={handleChange} />
        </div>
        <div>
          <label>Logo Perusahaan</label>
          <input
            ref={fileInputRef}
            name="heroImage"
            type="file"
            accept="image/*"
            onChange={(e) => setHeroImage(e.target.files[0])}
          />
          <small style={{ color: '#6b7280' }}>Format rekomendasi: PNG dengan latar belakang transparan.</small>
        </div>
        <button className="primary-button" type="submit">
          Simpan
        </button>
        {status && <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>}
      </form>
    </div>
  );
};

export default CompanyProfileAdmin;
