import React, { useState } from 'react';

const Blog = () => {
  const [expandedPost, setExpandedPost] = useState(null);

  const posts = [
    {
      id: 1,
      title: 'Mülakatlarda Ajan Gibi Soğukkanlı Olmanın 5 Yolu',
      excerpt: 'Stresli durumlarda vücut dilinizi nasıl kontrol edersiniz? Gizli servis teknikleriyle mülakatlarda başarıyı yakalayın.',
      content: 'Mülakatlar genellikle stresli ortamlardır. Ancak bir ajan gibi soğukkanlı kalabilmek mümkündür. İlk kural, nefesinizi kontrol etmektir. Derin ve yavaş nefes almak kalp atışınızı düzenler. İkinci olarak, göz teması kurmaktan çekinmeyin, bu özgüvenin en büyük göstergesidir. Üçüncüsü, ellerinizi masanın üzerinde ve görünür tutun, bu şeffaflık hissi verir. Dördüncüsü, soruları cevaplamadan önce 2 saniye bekleyin, bu size düşünme payı bırakır. Son olarak, mülakatı bir sorgu gibi değil, karşılıklı bir sohbet olarak görün.',
      date: '24 Mayıs 2026',
      readTime: '4 dk okuma'
    },
    {
      id: 2,
      title: 'Özgeçmişiniz Sizi Ele Veriyor mu?',
      excerpt: 'İşe alım uzmanlarının ilk 6 saniyede dikkat ettiği gizli detaylar. CV\'nizi nasıl daha profesyonel bir rapora dönüştürürsünüz?',
      content: 'İşe alım uzmanları bir CV\'ye ortalama 6 saniye bakar. Bu kısa sürede en çok dikkat ettikleri yerler: Geçmiş deneyimlerinizin netliği, kullanılan anahtar kelimeler ve tasarımın okunabilirliğidir. Karışık ve uzun paragraflar yerine madde imleri kullanın. Başarılarınızı sayılarla destekleyin (örneğin "satışları %20 artırdım"). Ayrıca hobiler kısmını gereksiz doldurmaktan kaçının, sadece işinizle veya kişisel gelişiminizle ilgili olanları ekleyin.',
      date: '18 Mayıs 2026',
      readTime: '6 dk okuma'
    },
    {
      id: 3,
      title: 'Ağ Kurma (Networking) Görevi',
      excerpt: 'Sektördeki önemli isimlerle bağlantı kurarken dikkat çekmeden güven oluşturmanın psikolojik taktikleri.',
      content: 'Etkili bir networking, doğrudan birilerinden iş istemek değildir. Önemli olan karşılıklı değer yaratmaktır. Hedeflediğiniz kişilerle LinkedIn veya etkinlikler üzerinden iletişime geçerken, önce onların paylaşımlarına anlamlı yorumlar yapın. İlk mesajınızda bir şey istemeyin, sadece tanışın veya ortak bir noktadan bahsedin. Zamanla bu bağ güvene dönüşecek ve fırsatlar kendiliğinden karşınıza çıkacaktır.',
      date: '10 Mayıs 2026',
      readTime: '5 dk okuma'
    }
  ];

  const togglePost = (id) => {
    if (expandedPost === id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(id);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-8" style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Ajanın <span style={{ color: 'var(--accent-neon)' }}>Kariyer Dosyaları</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>İş dünyasında bir adım önde olmanız için taktiksel kariyer tavsiyeleri.</p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <div key={post.id} className="glass-card" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-blue)' }}>{post.title}</h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {expandedPost === post.id ? post.content : post.excerpt}
            </p>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.5rem 1.25rem' }}
              onClick={() => togglePost(post.id)}
            >
              {expandedPost === post.id ? 'Dosyayı Kapat' : 'Dosyayı Oku'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
