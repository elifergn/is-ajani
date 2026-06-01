import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('is_ajani_token', data.token);
        localStorage.setItem('is_ajani_user', JSON.stringify(data.user));
        navigate('/');
        window.location.reload();
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Sistem bağlantı hatası');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Lock size={32} color="var(--accent-neon)" />
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>Sisteme Giriş</h2>
          <p style={{ color: 'var(--text-muted)' }}>Ajan ağına kimliğinizi doğrulayın</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ajan Kod Adı (Kullanıcı Adı)</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Kimliği Doğrula
          </button>
        </form>

        <div className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Henüz ajan ağında değil misiniz? <Link to="/register" style={{ color: 'var(--accent-neon)' }}>Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
