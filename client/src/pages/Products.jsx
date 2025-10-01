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

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Produk Kami</h1>
        <div className="card-grid">
          {products.map((product) => (
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
              {product.price && <strong>Rp {Number(product.price).toLocaleString('id-ID')}</strong>}
            </div>
          ))}
          {products.length === 0 && <p>Belum ada data produk.</p>}
        </div>
      </div>
    </main>
  );
};

export default Products;
