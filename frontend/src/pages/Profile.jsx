import React, { useState, useEffect } from 'react';
import { Building, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Profile = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('is_ajani_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApplications(token);
  }, [navigate]);

  const fetchApplications = async (token) => {
    try {
      const res = await fetch(`${API_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '4rem' }}>Yükleniyor...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-8" style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Benim <span style={{ color: 'var(--accent-neon)' }}>Görevlerim</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Başvuru yaptığınız açık operasyonlar ve pozisyonlar.</p>
      </div>

      <div className="flex flex-col gap-4">
        {applications.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Henüz hiçbir gizli göreve başvurmadınız.</p>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--accent-blue)' }}>{app.title}</h3>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Building size={14} /> {app.company}
                  </div>
                </div>
                <span className="badge">{app.category}</span>
              </div>
              <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {app.description}
              </p>
              <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <MapPin size={14} /> Remote / İstanbul
                </span>
                <span style={{ color: 'var(--accent-neon)', fontSize: '0.85rem', fontWeight: '500' }}>
                  Başvuru Tarihi: {new Date(app.applied_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
