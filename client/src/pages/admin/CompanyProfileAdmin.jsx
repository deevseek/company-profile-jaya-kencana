import { useEffect, useState } from 'react';
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
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
          setHeroImage(null);
          setStatus(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
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
    } catch (error) {
      console.error('Failed to save profile', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  return (
    <div className="card" style={{ background: '#fff', display: 'grid', gap: '1.5rem' }}>
      <h1>Profil Perusahaan</h1>
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
          <label>Hero Image</label>
          <input name="heroImage" type="file" accept="image/*" onChange={(e) => setHeroImage(e.target.files[0])} />
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
