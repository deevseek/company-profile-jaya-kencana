import { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchProducts();
  }, []);

  const getWhatsAppDetails = (rawValue) => {
    if (!rawValue && rawValue !== 0) return null;

    const digits = String(rawValue).replace(/\D/g, '');
    if (!digits) return null;

    const normalized = digits.startsWith('62')
      ? digits
      : digits.startsWith('0')
      ? `62${digits.slice(1)}`
      : `62${digits}`;

    const display = normalized.startsWith('62') ? `+${normalized}` : normalized;

    return {
      link: `https://wa.me/${normalized}`,
      display
    };
  };

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Produk Kami</h1>
        <div className="card-grid">
          {products.map((product) => {
            const whatsapp = getWhatsAppDetails(product.contactNumber);

            return (
              <div key={product.id} className="card">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ borderRadius: '12px', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {whatsapp && (
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Kontak: {whatsapp.display}</span>
                    <a
                      href={whatsapp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button"
                      style={{ textAlign: 'center' }}
                    >
                      Hubungi via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })}
          {products.length === 0 && <p>Belum ada data produk.</p>}
        </div>
      </div>
    </main>
  );
};

export default Products;
