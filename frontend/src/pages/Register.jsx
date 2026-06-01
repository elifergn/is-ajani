import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullname: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error('Sunucudan geçersiz yanıt alındı (Bağlantı hatası olabilir).');
      }
      
      if (res.ok) {
        alert('Ajan ağına kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        navigate('/login');
      } else {
        setError(data.error || 'Kayıt işlemi sırasında bir sorun oluştu.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'Sistem bağlantı hatası. Lütfen sunucunun çalıştığından emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <UserPlus size={32} color="var(--accent-neon)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Ağa Katıl</h2>
          <p style={{ color: 'var(--text-muted)' }}>Yeni bir ajan profili oluşturun</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <strong>Hata:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adı Soyadı</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.fullname}
              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-posta Adresi</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
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
          
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Mail size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>E-posta Bildirimleri</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Ağa katıldıktan sonra yaptığınız tüm iş başvuruları için onay ve bilgilendirme mailleri kayıtlı e-posta adresinize gönderilecektir.
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Bağlanıyor...' : 'Profili Oluştur'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Zaten ajan ağındaysanız: <Link to="/login" style={{ color: 'var(--accent-neon)', fontWeight: '600' }}>Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
