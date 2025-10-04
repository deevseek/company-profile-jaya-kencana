import { useEffect, useState } from 'react';
import axios from 'axios';

const initialState = { title: '', description: '' };

const GalleryAdmin = ({ token }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchGallery = async () => {
    try {
      const { data } = await axios.get('/api/gallery');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch gallery', error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) {
        formData.append('image', image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingId) {
        await axios.put(`/api/gallery/${editingId}`, formData, config);
        setStatus({ type: 'success', message: 'Item galeri berhasil diperbarui.' });
      } else {
        await axios.post('/api/gallery', formData, config);
        setStatus({ type: 'success', message: 'Item galeri berhasil ditambahkan.' });
      }

      setForm(initialState);
      setImage(null);
      setEditingId(null);
      fetchGallery();
    } catch (error) {
      console.error('Failed to save gallery item', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title || '', description: item.description || '' });
    setEditingId(item.id);
    setImage(null);
    setStatus(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus item ini?')) return;
    try {
      await axios.delete(`/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Item galeri berhasil dihapus.' });
      fetchGallery();
    } catch (error) {
      console.error('Failed to delete gallery item', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menghapus data.' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div className="card" style={{ background: '#fff' }}>
        <h1>{editingId ? 'Edit Item Galeri' : 'Tambah Item Galeri'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Judul</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Deskripsi</label>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button className="primary-button" type="submit">
            {editingId ? 'Perbarui' : 'Tambah'}
          </button>
          {status && <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>}
        </form>
      </div>

      <div className="card" style={{ background: '#fff' }}>
        <h2>Galeri</h2>
        <div className="card-grid">
          {items.map((item) => (
            <div key={item.id} className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    borderRadius: '12px',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    backgroundColor: '#f8fafc'
                  }}
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="primary-button" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="primary-button"
                  style={{ background: '#dc2626' }}
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p>Belum ada item galeri.</p>}
        </div>
      </div>
    </div>
  );
};

export default GalleryAdmin;
