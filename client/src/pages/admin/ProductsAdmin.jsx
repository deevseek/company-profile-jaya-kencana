import { useEffect, useState } from 'react';
import axios from 'axios';

const initialState = { name: '', description: '', contactNumber: '' };

const ProductsAdmin = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  const getWhatsAppDetails = (value) => {
    if (!value && value !== 0) return null;

    const digits = String(value).replace(/\D/g, '');
    if (!digits) return null;

    const normalized = digits.startsWith('62')
      ? digits
      : digits.startsWith('0')
      ? `62${digits.slice(1)}`
      : `62${digits}`;

    return {
      normalized,
      display: `+${normalized}`,
      link: `https://wa.me/${normalized}`
    };
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === 'contactNumber' ? value.replace(/\D/g, '') : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('contactNumber', form.contactNumber);
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
        await axios.put(`/api/products/${editingId}`, formData, config);
        setStatus({ type: 'success', message: 'Produk berhasil diperbarui.' });
      } else {
        await axios.post('/api/products', formData, config);
        setStatus({ type: 'success', message: 'Produk berhasil ditambahkan.' });
      }

      setForm(initialState);
      setImage(null);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      contactNumber:
        (product.contactNumber && String(product.contactNumber).replace(/\D/g, '')) || ''
    });
    setEditingId(product.id);
    setImage(null);
    setStatus(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Produk berhasil dihapus.' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menghapus data.' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div className="card" style={{ background: '#fff' }}>
        <h1>{editingId ? 'Edit Produk' : 'Tambah Produk'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nama Produk</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Deskripsi</label>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label>Kontak WhatsApp</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Contoh: 628123456789"
            />
          </div>
          <div>
            <label>Foto Produk</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button className="primary-button" type="submit">
            {editingId ? 'Perbarui' : 'Tambah'}
          </button>
          {status && <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>}
        </form>
      </div>

      <div className="card" style={{ background: '#fff' }}>
        <h2>Daftar Produk</h2>
        <div className="card-grid">
          {products.map((product) => {
            const whatsapp = getWhatsAppDetails(product.contactNumber);

            return (
              <div key={product.id} className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
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
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {whatsapp && (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <strong>Kontak WhatsApp: {whatsapp.display}</strong>
                    <a
                      href={whatsapp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button"
                      style={{ textAlign: 'center' }}
                    >
                      Kirim Pesan
                    </a>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" className="primary-button" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    style={{ background: '#dc2626' }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
          {products.length === 0 && <p>Belum ada produk.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
