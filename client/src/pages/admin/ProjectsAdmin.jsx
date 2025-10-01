import { useEffect, useState } from 'react';
import axios from 'axios';

const initialState = { title: '', client: '', year: '', description: '' };

const ProjectsAdmin = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  useEffect(() => {
    fetchProjects();
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
        await axios.put(`/api/projects/${editingId}`, formData, config);
        setStatus({ type: 'success', message: 'Proyek berhasil diperbarui.' });
      } else {
        await axios.post('/api/projects', formData, config);
        setStatus({ type: 'success', message: 'Proyek berhasil ditambahkan.' });
      }

      setForm(initialState);
      setImage(null);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menyimpan data.' });
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      client: project.client || '',
      year: project.year || '',
      description: project.description || ''
    });
    setEditingId(project.id);
    setImage(null);
    setStatus(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus proyek ini?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Proyek berhasil dihapus.' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
      setStatus({ type: 'error', message: 'Terjadi kesalahan saat menghapus data.' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div className="card" style={{ background: '#fff' }}>
        <h1>{editingId ? 'Edit Proyek' : 'Tambah Proyek'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Judul Proyek</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Klien</label>
            <input name="client" value={form.client} onChange={handleChange} />
          </div>
          <div>
            <label>Tahun</label>
            <input name="year" value={form.year} onChange={handleChange} />
          </div>
          <div>
            <label>Deskripsi</label>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label>Foto Proyek</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button className="primary-button" type="submit">
            {editingId ? 'Perbarui' : 'Tambah'}
          </button>
          {status && <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>}
        </form>
      </div>

      <div className="card" style={{ background: '#fff' }}>
        <h2>Daftar Proyek</h2>
        <div className="card-grid">
          {projects.map((project) => (
            <div key={project.id} className="card" style={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{ borderRadius: '12px', height: '160px', objectFit: 'cover' }}
                />
              )}
              <h3>{project.title}</h3>
              <p>{project.client}</p>
              <p>{project.year}</p>
              <p>{project.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="primary-button" onClick={() => handleEdit(project)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="primary-button"
                  style={{ background: '#dc2626' }}
                  onClick={() => handleDelete(project.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p>Belum ada proyek.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectsAdmin;
