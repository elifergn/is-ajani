import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, BookOpen, UserCircle, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Yazılım', 'Tasarım', 'Sağlık', 'Eğitim', 'Finans'];

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('is_ajani_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('is_ajani_token');
    localStorage.removeItem('is_ajani_user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar animate-fade-in">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <img src="/logo.png" alt="İş Ajanı Logo" />
          İş Ajanı
        </Link>
        <div className="nav-links">
          
          {/* İş Alanları Dropdown */}
          <div className="relative dropdown-container" ref={dropdownRef}>
            <button 
              className="nav-link flex items-center gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              <Briefcase size={18} /> İş Alanları <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu glass-card">
                <Link 
                  to="/jobs" 
                  onClick={() => setDropdownOpen(false)} 
                  className="dropdown-item" 
                  style={{ borderBottom: '1px solid var(--glass-border)' }}
                >
                  Tüm İlanlar
                </Link>
                {CATEGORIES.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/jobs?category=${cat}`} 
                    onClick={() => setDropdownOpen(false)} 
                    className="dropdown-item"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/blog" className="nav-link flex items-center gap-2">
            <BookOpen size={18} /> Blog
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="nav-link flex items-center gap-2 mr-4 text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                <UserCircle size={18} /> Ajan {user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={16} /> Çıkış
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Giriş Yap</Link>
              <Link to="/register" className="btn btn-primary">
                <User size={18} /> Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
