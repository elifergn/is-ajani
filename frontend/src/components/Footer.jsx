import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer animate-fade-in">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="flex items-center gap-2" style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-main)' }}>
            <img src="/logo.png" alt="İş Ajanı Logo" style={{ height: '30px', borderRadius: '6px' }} />
            İş Ajanı
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', marginTop: '0.5rem' }}>
            Ajan ağımızla gizli iş fırsatlarını tespit edin ve kariyerinizi operasyonel başarıya taşıyın.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-link-group">
            <h4>Operasyonlar</h4>
            <Link to="/jobs" className="footer-link">Tüm İlanlar</Link>
            <Link to="/jobs?category=Yazılım" className="footer-link">Yazılım</Link>
            <Link to="/jobs?category=Tasarım" className="footer-link">Tasarım</Link>
            <Link to="/jobs?category=Finans" className="footer-link">Finans</Link>
          </div>

          <div className="footer-link-group">
            <h4>Rehber</h4>
            <Link to="/blog" className="footer-link">Kariyer Blogu</Link>
            <Link to="/" className="footer-link">Gizlilik Politikası</Link>
            <Link to="/" className="footer-link">Kullanım Şartları</Link>
          </div>

          <div className="footer-link-group">
            <h4>İletişim & Geliştirici</h4>
            <span className="footer-link" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Created by Elif Ergen</span>
            <span className="footer-link">İletişim: 0505 001 36 78</span>
            <div className="social-icons" style={{ marginTop: '0.5rem' }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="mailto:info@isajani.com" className="social-icon">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="flex items-center justify-center gap-1">
          <Shield size={14} style={{ color: 'var(--accent-neon)' }} />
          <span>&copy; {new Date().getFullYear()} İş Ajanı. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
