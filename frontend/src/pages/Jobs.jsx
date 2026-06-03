import React, { useState, useEffect } from 'react';
import { MapPin, Building, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs(categoryParam);
  }, [categoryParam]);

  const fetchJobs = async (category) => {
    setLoading(true);
    try {
      const url = category ? `${API_URL}/jobs?category=${category}` : `${API_URL}/jobs`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleApply = async (jobId) => {
    const token = localStorage.getItem('is_ajani_token');
    if (!token) {
      alert('Bu ilana başvurmak için lütfen giriş yapın veya kayıt olun.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('Başvurunuz başarıyla alındı! Durumunu profilinizden takip edebilirsiniz.');
      } else {
        alert('Başvuru sırasında bir hata oluştu veya zaten başvurdunuz.');
      }
    } catch (err) {
      console.error('Apply error:', err);
      alert('Bir hata oluştu.');
    }
  };


  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.5rem' }}>
            {categoryParam ? `${categoryParam} Sektörü Görevleri` : 'Tüm Gizli Operasyonlar'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {categoryParam ? `${categoryParam} alanında tespit edilen aktif kariyer fırsatları listelenmektedir.` : 'Ajanlarımız tarafından sızdırılan tüm aktif kariyer fırsatları.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '6rem' }}>
          <Search className="animate-spin" size={48} style={{ color: 'var(--accent-blue)', margin: '0 auto' }} />
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Ajanlar veri tabanlarını tarıyor...</p>
        </div>
      ) : (
        <div className="grid-2">
          {jobs.map(job => (
            <div key={job.id} className="glass-card" style={{ padding: '2rem' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{job.title}</h3>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <Building size={16} /> {job.company}
                  </div>
                </div>
                <span className="badge">{job.category}</span>
              </div>
              <div style={{
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                backgroundColor: 'rgba(56, 189, 248, 0.03)',
                padding: '1.2rem',
                borderRadius: '8px',
                borderLeft: '3px solid var(--border-color)'
              }}>
                {job.description}
              </div>
              <div className="flex justify-between items-center pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <MapPin size={16} /> Remote / İstanbul
                </span>
                <button
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1.5rem' }}
                  onClick={() => handleApply(job.id)}
                >
                  Görevi Devral (Başvur)
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Bu alanda henüz aktif bir görev bulunmamaktadır.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
