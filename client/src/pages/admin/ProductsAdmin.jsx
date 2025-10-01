import { useEffect, useState } from 'react';
import axios from 'axios';

const initialState = { name: '', description: '', price: '' };

const ProductsAdmin = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
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
      price: product.price || ''
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
            <label>Harga</label>
            <input name="price" value={form.price} onChange={handleChange} />
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
          {products.map((product) => (
            <div key={product.id} className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ borderRadius: '12px', height: '160px', objectFit: 'cover' }}
                />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              {product.price && <strong>Rp {Number(product.price).toLocaleString('id-ID')}</strong>}
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
          ))}
          {products.length === 0 && <p>Belum ada produk.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
