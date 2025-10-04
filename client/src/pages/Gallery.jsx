import { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get('/api/gallery');
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch gallery', error);
      }
    };

    fetchGallery();
  }, []);

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Galeri Proyek</h1>
        <div className="card-grid">
          {items.map((item) => (
            <div key={item.id} className="card">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    borderRadius: '12px',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '220px',
                    objectFit: 'contain',
                    backgroundColor: '#f8fafc'
                  }}
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
          {items.length === 0 && <p>Belum ada data galeri.</p>}
        </div>
      </div>
    </main>
  );
};

export default Gallery;
