import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/api/projects');
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };

    fetchProjects();
  }, []);

  const projectsByYear = useMemo(() => {
    return projects.reduce((acc, project) => {
      const year = project.year || 'Lainnya';
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    }, {});
  }, [projects]);

  return (
    <main className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem' }}>
        <header style={{ textAlign: 'center' }}>
          <h1 className="section-title">Portofolio Proyek</h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Jelajahi proyek-proyek unggulan yang telah kami selesaikan untuk berbagai klien industri di seluruh Indonesia.
          </p>
        </header>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {Object.entries(projectsByYear)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([year, items]) => (
              <section key={year} className="card" style={{ background: '#fff' }}>
                <h2>{year}</h2>
                <div className="card-grid">
                  {items.map((project) => (
                    <div key={project.id} className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          style={{ borderRadius: '12px', height: '180px', objectFit: 'cover' }}
                        />
                      )}
                      <h3>{project.title}</h3>
                      <p>{project.client}</p>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{project.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          {projects.length === 0 && <p>Belum ada data proyek.</p>}
        </div>
      </div>
    </main>
  );
};

export default Portfolio;
