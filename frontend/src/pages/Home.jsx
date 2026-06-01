import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  PenTool, 
  HeartPulse, 
  GraduationCap, 
  DollarSign, 
  ExternalLink, 
  Globe, 
  Newspaper
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Yazılım', icon: Monitor },
  { name: 'Tasarım', icon: PenTool },
  { name: 'Sağlık', icon: HeartPulse },
  { name: 'Eğitim', icon: GraduationCap },
  { name: 'Finans', icon: DollarSign }
];

const OFFICIAL_LINKS = [
  {
    name: 'İŞKUR',
    description: 'Türkiye İş Kurumu resmi portalı. Devlet destekli iş imkanları, mesleki eğitim kursları ve istihdam teşvikleri.',
    url: 'https://www.iskur.gov.tr/',
    badge: 'Resmi Kurum'
  },
  {
    name: 'Kariyer.net',
    description: 'Türkiye\'nin en büyük yerel iş bulma platformu. Binlerce şirketlerin ilanlarına erişin ve özgeçmişinizi paylaşın.',
    url: 'https://www.kariyer.net/',
    badge: 'Özel Platform'
  },
  {
    name: 'LinkedIn',
    description: 'Profesyonel ağ kurma ve küresel iş ilanları. Sektör liderleriyle bağlantı kurun ve iş fırsatlarını takip edin.',
    url: 'https://www.linkedin.com/',
    badge: 'Global Ağ'
  },
  {
    name: 'Indeed Türkiye',
    description: 'Binlerce iş ilanını tek bir yerde arayın. Şirket puanlamaları, maaş karşılaştırmaları ve kolay başvuru.',
    url: 'https://tr.indeed.com/',
    badge: 'Arama Motoru'
  }
];

const NEWS_UPDATES = [
  {
    category: 'Yazılım',
    title: 'Yazılım Geliştiricler İçin Uzaktan Çalışma Kalıcı Hale Geliyor',
    snippet: 'Teknoloji devleri 2026 yılı için uzaktan (remote) ve hibrit çalışma modellerini kalıcı operasyon modeli olarak benimsediklerini duyurdu. Sınır ötesi sözleşmeli yazılımcı alımlarında %25 artış gözleniyor.',
    date: '1 Haziran 2026'
  },
  {
    category: 'Tasarım',
    title: 'Üretken Yapay Zeka Tasarım Süreçlerini Hızlandırıyor',
    snippet: 'UI/UX tasarımında yapay zeka araçları (Figma AI, Midjourney) kullanımının artmasıyla tasarımcıların arayüz oluşturma süreleri kısaldı. Şirketler artık derinlemesine kullanıcı deneyimi analitiğine odaklanan tasarımcıları tercih ediyor.',
    date: '30 Mayıs 2026'
  },
  {
    category: 'Finans',
    title: 'Açık Bankacılık ve Fintech Alanında İstihdam Patlaması',
    snippet: 'Yeni nesil ödeme sistemleri ve blockchain tabanlı finans çözümlerinin yaygınlaşmasıyla, finansal teknoloji girişimlerinde yazılım ve uyum (compliance) uzmanı arayışı zirveye ulaştı.',
    date: '28 Mayıs 2026'
  },
  {
    category: 'Sağlık',
    title: 'Dijital Sağlık ve Teletıp Hizmetlerinde Yeni Kadrolar',
    snippet: 'Sağlık Bakanlığı desteğiyle geliştirilen uzaktan takip sistemleri, teletıp danışmanları ve evde bakım fizyoterapistleri için geniş ölçekli iş ilanları yayınlanmaya başlandı.',
    date: '25 Mayıs 2026'
  },
  {
    category: 'Eğitim',
    title: 'Kurumsal Eğitim Akademileri ve E-Öğrenme Tasarımcılığı Revaçta',
    snippet: 'Büyük ölçekli holdinglerin kendi iç eğitim akademilerini kurma ve dijital içerik hazırlama süreçlerine yatırım yapmalarıyla e-öğrenme (instructional) tasarımcılarına olan talep son bir yılda ikiye katlandı.',
    date: '20 Mayıs 2026'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8" style={{ padding: '3.5rem 0 1.5rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.2rem', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
          Gizli Fırsatları <span style={{ color: 'var(--accent-neon)' }}>Keşfedin</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto' }}>
          İş Ajanı, size en uygun pozisyonları bulmak için seçkin şirketlerin veri tabanlarında ve kurumsal ağlarda çalışır.
        </p>
      </div>

      {/* Modern Kategori Kartları */}
      <div className="grid-5 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '4.5rem' }}>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <div 
              key={cat.name}
              className="category-card"
              onClick={() => navigate(`/jobs?category=${cat.name}`)}
            >
              <div className="icon-wrapper">
                <Icon size={32} />
              </div>
              <h3>{cat.name}</h3>
            </div>
          );
        })}
      </div>

      {/* Resmi Platformlar & Faydalı Linkler */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="section-title">Faydalı Linkler / Resmi Platformlar</h2>
        <div className="links-grid">
          {OFFICIAL_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="glass-card link-card"
            >
              <div className="link-icon-wrapper">
                <Globe size={20} />
              </div>
              <div className="link-card-content">
                <div className="flex items-center gap-2 mb-1" style={{ flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--text-main)', margin: 0 }}>
                    {link.name} <ExternalLink size={14} style={{ opacity: 0.6, marginLeft: '4px' }} />
                  </h3>
                  <span className="badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{link.badge}</span>
                </div>
                <p>{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Sektörel Son Dakika Haberleri */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="flex items-center gap-2 mb-6">
          <Newspaper size={24} style={{ color: 'var(--accent-neon)' }} />
          <h2 className="section-title" style={{ marginBottom: 0 }}>Sektörel Son Dakika Haberleri</h2>
        </div>
        
        <div className="news-list">
          {NEWS_UPDATES.map((news, idx) => (
            <div key={idx} className="glass-card news-item">
              <div className="news-meta">
                <span className="badge" style={{ padding: '0.15rem 0.6rem' }}>{news.category}</span>
                <span>{news.date}</span>
              </div>
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
