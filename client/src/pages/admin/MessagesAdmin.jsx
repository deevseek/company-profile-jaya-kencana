import { useEffect, useState } from 'react';
import axios from 'axios';

const MessagesAdmin = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    try {
      await axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Pesan dihapus.' });
      fetchMessages();
    } catch (error) {
      console.error('Failed to delete message', error);
      setStatus({ type: 'error', message: 'Gagal menghapus pesan.' });
    }
  };

  return (
    <div className="card" style={{ background: '#fff' }}>
      <h1>Pesan Masuk</h1>
      {status && <p style={{ color: status.type === 'success' ? '#15803d' : '#dc2626' }}>{status.message}</p>}
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Subjek</th>
              <th>Pesan</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.subject}</td>
                <td>{item.message}</td>
                <td>{new Date(item.createdAt).toLocaleString('id-ID')}</td>
                <td>
                  <button
                    type="button"
                    className="primary-button"
                    style={{ background: '#dc2626' }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan="6">Belum ada pesan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesAdmin;
