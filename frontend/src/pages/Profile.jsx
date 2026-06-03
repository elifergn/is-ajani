import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, GraduationCap, Award, FileText, Upload, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cities, universities, departments } from '../constants/data';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_URL.replace('/api', '');

const Profile = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    username: '',
    phone: '',
    city: '',
    university: '',
    department: '',
    skills: '',
    cv_path: ''
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('is_ajani_token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    Promise.all([
      fetchApplications(token),
      fetchProfile(token)
    ]).finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

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
    }
  };

  const fetchProfile = async (token) => {
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          fullname: data.fullname || '',
          email: data.email || '',
          username: data.username || '',
          phone: data.phone || '',
          city: data.city || '',
          university: data.university || '',
          department: data.department || '',
          skills: data.skills || '',
          cv_path: data.cv_path || ''
        });
      } else {
        console.error('Failed to fetch profile info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showNotification('error', 'Lütfen sadece PDF formatında bir dosya yükleyin.');
        e.target.value = null; // Clear
        setCvFile(null);
        return;
      }
      setCvFile(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const token = localStorage.getItem('is_ajani_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('phone', profile.phone);
    formData.append('city', profile.city);
    formData.append('university', profile.university);
    formData.append('department', profile.department);
    formData.append('skills', profile.skills);
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        showNotification('success', 'Profiliniz ve CV bilgileriniz başarıyla güncellendi.');
        if (data.user) {
          setProfile({
            fullname: data.user.fullname || '',
            email: data.user.email || '',
            username: data.user.username || '',
            phone: data.user.phone || '',
            city: data.user.city || '',
            university: data.user.university || '',
            department: data.user.department || '',
            skills: data.user.skills || '',
            cv_path: data.user.cv_path || ''
          });
        }
        setCvFile(null);
      } else {
        showNotification('error', data.error || 'Profil güncellenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Bağlantı hatası oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '4rem' }}>Yükleniyor...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      
      {/* Profil Header */}
      <div className="glass-card text-center mb-8" style={{ padding: '2rem 1.5rem', marginTop: '1rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-neon) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'white',
          margin: '0 auto 1rem auto',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
        }}>
          {profile.fullname ? profile.fullname.charAt(0).toUpperCase() : 'A'}
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile.fullname}</h2>
        <p style={{ color: 'var(--accent-blue)', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: '500' }}>@{profile.username}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile.email}</p>
      </div>

      {/* Tab Switcher */}
      <div className="glass-card" style={{ display: 'flex', padding: '0.35rem', marginBottom: '2rem', borderRadius: '10px' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: activeTab === 'applications' ? 'var(--accent-blue)' : 'transparent',
            color: activeTab === 'applications' ? 'white' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '7px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          <Briefcase size={18} />
          Başvurularım ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('career')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: activeTab === 'career' ? 'var(--accent-blue)' : 'transparent',
            color: activeTab === 'career' ? 'white' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '7px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          <FileText size={18} />
          Kariyer / CV
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: notification.type === 'success' ? '#10b981' : '#ef4444',
          animation: 'fadeIn 0.3s ease'
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{notification.message}</span>
        </div>
      )}

      {/* Tab İçerikleri */}
      <div className="animate-fade-in">
        {activeTab === 'applications' ? (
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
                  <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
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
        ) : (
          <div className="glass-card" style={{ padding: '2rem 1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', color: 'var(--accent-blue)' }}>
              Kariyer & CV Bilgileri
            </h3>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="Örn: 05551234567"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} /> Şehir
                  </label>
                  <select
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-main)' }}
                  >
                    <option value="" style={{ backgroundColor: '#0f172a' }}>Şehir Seçin</option>
                    {cities.map(city => (
                      <option key={city} value={city} style={{ backgroundColor: '#0f172a' }}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={14} /> Üniversite
                  </label>
                  <select
                    name="university"
                    value={profile.university}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-main)' }}
                  >
                    <option value="" style={{ backgroundColor: '#0f172a' }}>Üniversite Seçin</option>
                    {universities.map(uni => (
                      <option key={uni} value={uni} style={{ backgroundColor: '#0f172a' }}>{uni}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={14} /> Bölüm
                  </label>
                  <select
                    name="department"
                    value={profile.department}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-main)' }}
                  >
                    <option value="" style={{ backgroundColor: '#0f172a' }}>Bölüm Seçin</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} style={{ backgroundColor: '#0f172a' }}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={14} /> Yetenekler
                </label>
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleInputChange}
                  placeholder="Örn: React, Node.js, SQLite, CSS (Virgülle ayırın)"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileText size={14} /> CV Yükleme (PDF)
                </label>
                
                {profile.cv_path && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Yüklü CV dosyanız mevcut</span>
                    </div>
                    <a
                      href={`${BASE_URL}${profile.cv_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      CV'yi Görüntüle
                    </a>
                  </div>
                )}

                <div style={{
                  position: 'relative',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.3)',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={24} style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
                      {cvFile ? cvFile.name : 'Yeni CV Dosyası Seç (Sadece PDF)'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Maksimum boyut: 5MB
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '600' }}
              >
                {submitting ? 'Güncelleniyor...' : 'Profil & CV Güncelle'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
