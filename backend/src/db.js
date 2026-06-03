const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// SQLite veritabanı dosya yolu (ortak Docker volume veya local backend klasörü)
const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'is_ajani.db');

// Gerekirse veri klasörünü oluştur
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite veritabanı bağlantı hatası:', err);
  } else {
    console.log('SQLite veritabanı bağlandı:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telegram_chat_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users tablosuna yeni profil ve CV kolonlarını ekle (ALTER TABLE)
    const addColumns = [
      "ALTER TABLE users ADD COLUMN phone TEXT",
      "ALTER TABLE users ADD COLUMN city TEXT",
      "ALTER TABLE users ADD COLUMN university TEXT",
      "ALTER TABLE users ADD COLUMN department TEXT",
      "ALTER TABLE users ADD COLUMN skills TEXT",
      "ALTER TABLE users ADD COLUMN cv_path TEXT"
    ];
    addColumns.forEach(queryStr => {
      db.run(queryStr, (err) => {
        if (err) {
          // Kolon zaten varsa hata verecektir, bunu gözardı edebiliriz
          if (!err.message.includes("duplicate column name")) {
            console.error("Users tablosu alter hatası:", err.message);
          }
        } else {
          console.log(`Veritabanı sütunu başarıyla eklendi: ${queryStr}`);
        }
      });
    });

    // 2. Jobs Tablosu (İş İlanları)
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        notified BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Subscriptions Tablosu (Abonelikler)
    db.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category)
      )
    `);

    // 4. Applications Tablosu (Başvurular)
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      )
    `);

    // Eğer iş ilanlarında eksik varsa her kategoriyi 5 ilana tamamlayacak şekilde ekle (Seed)
    const initialJobs = {
      'Yazılım': [
        { title: 'Senior Frontend Developer', company: 'TechNova Solutions', description: 'Görev Tanımı:\nŞirketimizin amiral gemisi olan SaaS platformunun web arayüzlerini React ve TypeScript kullanarak geliştirmek. Performans optimizasyonları yapmak ve UI/UX ekibiyle yakından çalışmak.\n\nAranan Nitelikler:\n- En az 5 yıl React ve modern JavaScript tecrübesi\n- State management (Redux, Zustand) konularına hakimiyet\n- Responsive tasarım ve CSS mimarileri (Tailwind, SASS) tecrübesi\n\nBaşvuru Şartları:\n- Github portfolyosu sunabilmek\n- Remote çalışmaya uygun olmak.' },
        { title: 'Backend Node.js Engineer', company: 'CodeBase Labs', description: 'Görev Tanımı:\nYüksek trafikli e-ticaret altyapımız için ölçeklenebilir mikroservisler tasarlamak ve geliştirmek. Veritabanı sorgularını optimize etmek ve API güvenliğini sağlamak.\n\nAranan Nitelikler:\n- Node.js ve Express/NestJS frameworklerinde derin bilgi\n- PostgreSQL/SQLite ve Redis ile çalışma tecrübesi\n- Docker hakkında bilgi sahibi olmak' },
        { title: 'Fullstack Yazılım Mühendisi', company: 'StartupX', description: 'Görev Tanımı:\nUçtan uca ürün geliştirme süreçlerinde aktif rol almak. Next.js ile frontend, Node.js/Python ile backend sistemlerini entegre etmek.\n\nAranan Nitelikler:\n- Hem Frontend hem Backend ekosistemlerine hakimiyet\n- RESTful API geliştirme tecrübesi' },
        { title: 'DevOps & Cloud Uzmanı', company: 'CloudNet', description: 'Görev Tanımı:\nCI/CD süreçlerini yönetmek, AWS altyapımızı optimize etmek ve sistem güvenliğini sağlamak.\n\nAranan Nitelikler:\n- AWS (EC2, S3, RDS, Lambda) servislerinde uzmanlık\n- Terraform veya Ansible gibi IaC araçlarını kullanabilme\n- Linux sistem yönetimi ve ağ güvenliği bilgisi\n\nBaşvuru Şartları:\n- 7/24 nöbet sistemine (on-call) uyum sağlayabilmek\n- Tercihen AWS Certified Solutions Architect sertifikasına sahip olmak' },
        { title: 'Mobile App Developer (Flutter)', company: 'Appify TR', description: 'Görev Tanımı:\nIOS ve Android platformları için çapraz platform (cross-platform) mobil uygulamalar geliştirmek, test etmek ve mağaza yayın süreçlerini yönetmek.\n\nAranan Nitelikler:\n- Dart dili ve Flutter frameworkü ile en az 2 yıl tecrübe\n- State Management (Provider, Bloc) kullanımı\n- Firebase ve REST API entegrasyonu tecrübesi\n\nBaşvuru Şartları:\n- Yayında olan en az 1 mobil uygulama referansı gösterebilmek' }
      ],
      'Tasarım': [
        { title: 'Kıdemli UI/UX Designer', company: 'Creative Studio', description: 'Görev Tanımı:\nWeb ve mobil uygulamalarımız için kullanıcı deneyimini merkeze alan, estetik ve işlevsel arayüzler tasarlamak. Kullanıcı testleri organize edip veriye dayalı tasarım kararları almak.\n\nAranan Nitelikler:\n- Figma konularında ileri düzey yetkinlik\n- Kullanıcı araştırma metodolojileri ve A/B testi tecrübesi\n- Prototipleme ve wireframing becerileri' },
        { title: 'Grafik Tasarım Uzmanı', company: 'AdAgency', description: 'Görev Tanımı:\nMarkalarımız için sosyal medya görselleri, dijital reklam materyalleri (banner, afiş) ve kurumsal kimlik tasarımları üretmek.\n\nAranan Nitelikler:\n- Adobe Photoshop, Illustrator ve InDesign programlarına hakimiyet\n- Tipografi, renk teorisi ve kompozisyon prensiplerini iyi bilmek' },
        { title: 'Motion Graphics Designer', company: 'VideoPro', description: 'Görev Tanımı:\nSosyal medya reklamları ve tanıtım videoları için 2D/3D hareketli grafikler, animasyonlar ve video kurguları hazırlamak.\n\nAranan Nitelikler:\n- After Effects, Premiere Pro uzmanlığı\n- Tercihen Cinema 4D veya Blender bilgisi\n- Ses kurgusu ve ritmik video kurgusu yeteneği\n\nBaşvuru Şartları:\n- Video showreel sunumu zorunludur' },
        { title: 'Oyun Tasarımcısı (Game Designer)', company: 'Pixel Play', description: 'Görev Tanımı:\nMobil hyper-casual ve casual oyunlar için bölüm (level) tasarımı, oyun mekanikleri kurgulama ve karakter konseptleri oluşturmak.\n\nAranan Nitelikler:\n- Unity 3D ekosistemine aşinalık\n- Oyun ekonomisi ve kullanıcı tutundurma (retention) metrikleri hakkında bilgi\n- Yaratıcı hikaye anlatımı becerisi\n\nBaşvuru Şartları:\n- Oyun sektörüne tutkuyla bağlı olmak ve aktif bir oyuncu olmak' },
        { title: 'Endüstriyel Ürün Tasarımcısı', company: 'TechHardware', description: 'Görev Tanımı:\nYeni nesil akıllı ev aletleri için ergonomik, estetik ve üretilebilir donanım tasarımları (CAD modelleme) yapmak.\n\nAranan Nitelikler:\n- SolidWorks, Rhino veya Fusion 360 programlarına tam hakimiyet\n- Malzeme bilgisi ve üretim teknikleri (enjeksiyon vb.) konusunda deneyim\n- Prototipleme (3D baskı) süreçlerine hakimiyet\n\nBaşvuru Şartları:\n- Endüstriyel Tasarım bölümü mezunu olmak' }
      ],
      'Sağlık': [
        { title: 'Klinik Araştırma Hemşiresi', company: 'Şifa Hastanesi', description: 'Görev Tanımı:\nKlinik araştırma fazlarında görev almak, hastaların takibini yapmak, araştırma verilerini doğru şekilde raporlamak ve hekimlere asistanlık yapmak.\n\nAranan Nitelikler:\n- İyi Klinik Uygulamaları (GCP) sertifikasına sahip olmak\n- İleri düzeyde hasta iletişim becerileri' },
        { title: 'Uzman Psikolog', company: 'Zihin Terapi Merkezi', description: 'Görev Tanımı:\nDanışanlara bireysel psikoterapi desteği sağlamak, psikolojik testler (MMPI vb.) uygulamak ve gelişim takibi raporları hazırlamak.\n\nAranan Nitelikler:\n- Bilişsel Davranışçı Terapi (BDT) veya EMDR eğitimi almış olmak\n- Empati yeteneği yüksek, etik değerlere bağlı çalışma prensibi\n- Etkili dinleme ve iletişim becerileri\n\nBaşvuru Şartları:\n- Psikoloji lisans ve Klinik Psikoloji yüksek lisans derecesi\n- Terapi uygulamak için gerekli sertifikasyonlar' },
        { title: 'Fizyoterapist', company: 'Sağlıklı Yaşam', description: 'Görev Tanımı:\nOrtopedik ve nörolojik rehabilitasyon hastalarının fizyoterapi programlarını planlamak ve uygulamak. Manuel terapi ve egzersiz danışmanlığı vermek.\n\nAranan Nitelikler:\n- Manuel terapi, dry needling gibi tekniklerde sertifika sahibi olmak\n- İnsan anatomisi ve kinezyolojisine ileri derecede hakimiyet\n- Güleryüzlü ve motive edici yaklaşım\n\nBaşvuru Şartları:\n- Fizyoterapi ve Rehabilitasyon bölümü lisans mezuniyeti\n- Tam zamanlı çalışmaya uygunluk' },
        { title: 'Diş Hekimi (Ortodonti)', company: 'Gülüş Estetiği', description: 'Görev Tanımı:\nÇene ve diş bozukluklarının teşhis, planlama ve tedavisini (tel, şeffaf plak uygulamaları) gerçekleştirmek. Hastalara ağız sağlığı eğitimi vermek.\n\nAranan Nitelikler:\n- Dijital diş hekimliği (CAD/CAM, ağız içi tarayıcılar) tecrübesi\n- Invisalign veya benzeri şeffaf plak sistemlerinde sertifikasyon\n- Yüksek hasta memnuniyeti odaklı çalışma\n\nBaşvuru Şartları:\n- Diş Hekimliği Fakültesi mezuniyeti ve Ortodonti alanında uzmanlık\n- İlgili meslek odasına kayıtlı olmak' },
        { title: 'Diyetisyen ve Beslenme Uzmanı', company: 'FitLife Klinik', description: 'Görev Tanımı:\nDanışanların sağlık durumlarına ve hedeflerine uygun kişiselleştirilmiş beslenme programları hazırlamak, kilo kontrolü süreçlerini takip etmek.\n\nAranan Nitelikler:\n- Vücut analiz cihazlarını (InBody vb.) etkin kullanabilme\n- Güncel beslenme trendlerini ve literatürü takip etme\n- Etkili ikna ve motivasyon becerileri\n\nBaşvuru Şartları:\n- Beslenme ve Diyetetik bölümü lisans derecesi\n- Klinik veya sporcu beslenmesi alanında en az 1 yıl tecrübe' }
      ],
      'Eğitim': [
        { title: 'İngilizce Öğretmeni', company: 'Global English Academy', description: 'Görev Tanımı:\nYetişkinlere ve kurumsal firmalara yönelik online ve yüz yüze İngilizce konuşma/dil bilgisi dersleri vermek. Öğrencilerin gelişimini takip etmek.\n\nAranan Nitelikler:\n- CELTA, TESOL veya TEFL sertifikalarından birine sahip olmak\n- Enerjik ve interaktif ders işleme yeteneği' },
        { title: 'E-Öğrenme (E-Learning) Uzmanı', company: 'EdTech TR', description: 'Görev Tanımı:\nŞirket içi eğitim akademileri için etkileşimli dijital eğitim içerikleri ve LMS (Learning Management System) altyapıları hazırlamak.\n\nAranan Nitelikler:\n- Articulate Storyline, Adobe Captivate gibi araçlara hakimiyet\n- Öğretim tasarımı (Instructional Design) modellerini bilmek\n- Temel düzeyde video/ses kurgu (Premiere, Audition) becerisi\n\nBaşvuru Şartları:\n- Eğitim Teknolojileri veya BÖTE (Bilgisayar ve Öğretim Teknolojileri) mezuniyeti' },
        { title: 'Sınav Hazırlık Rehber Öğretmeni', company: 'Başarı Dershaneleri', description: 'Görev Tanımı:\nYKS/LGS dönemindeki öğrencilere kariyer danışmanlığı yapmak, çalışma programları hazırlamak ve sınav kaygısına yönelik motivasyon çalışmaları yürütmek.\n\nAranan Nitelikler:\n- Eğitim psikolojisi ve ergenlik dönemi gelişim özellikleri hakkında bilgi\n- Güçlü iletişim ve veli/öğrenci ikna kabiliyeti\n- ÖSYM sınav sistemleri ve tercih dönemi süreçlerine uzmanlık seviyesinde hakimiyet\n\nBaşvuru Şartları:\n- PDR (Psikolojik Danışmanlık ve Rehberlik) lisans mezunu olmak' },
        { title: 'Kurumsal Eğitmen (Soft Skills)', company: 'HR Solutions', description: 'Görev Tanımı:\nKurumsal firmaların çalışanlarına yönelik Liderlik, İletişim, Zaman Yönetimi, ve Takım Çalışması konularında interaktif workshoplar düzenlemek.\n\nAranan Nitelikler:\n- Yetişkin eğitimi (Andragoji) prensiplerine hakimiyet\n- Mükemmel sunum ve topluluk önünde konuşma becerisi\n- Eğitim ihtiyaç analizi yapabilme yetkinliği\n\nBaşvuru Şartları:\n- Alanında en az 5 yıl kurumsal eğitim verme deneyimi\n- Tercihen ICF onaylı koçluk sertifikası' },
        { title: 'Kodlama Eğitmeni (Çocuklar İçin)', company: 'Geleceğin Yıldızları', description: 'Görev Tanımı:\n7-14 yaş arası çocuklara Scratch, Roblox Studio, Python ve temel robotik kodlama eğitimleri vermek. Proje tabanlı öğrenme etkinlikleri düzenlemek.\n\nAranan Nitelikler:\n- Çocuklarla iletişimi kuvvetli, sabırlı ve eğlenceli öğretim tarzı\n- Blok tabanlı kodlama ve temel algoritmik düşünce becerileri\n- STEM eğitim yaklaşımına ilgi duymak\n\nBaşvuru Şartları:\n- Pedagojik formasyon eğitimi almış olmak\n- Hafta sonu çalışma programına uyum sağlayabilmek' }
      ],
      'Finans': [
        { title: 'Kıdemli Finansal Analist', company: 'Global Bank', description: 'Görev Tanımı:\nŞirketin bütçe gerçekleşmelerini analiz etmek, finansal modelleme yapmak, nakit akışı tabloları hazırlamak ve üst yönetime raporlamak.\n\nAranan Nitelikler:\n- İleri düzey MS Excel ve PowerBI kullanımı\n- Finansal tablo okuma ve analiz etme uzmanlığı' },
        { title: 'Kripto Varlık Uzmanı', company: 'CoinMarket TR', description: 'Görev Tanımı:\nKripto para piyasalarını (DeFi, Web3) yakından takip etmek, token ekonomileri (tokenomics) üzerine araştırmalar yapmak ve kullanıcılara yatırım stratejileri geliştirmek.\n\nAranan Nitelikler:\n- Blockchain teknolojisi ve akıllı sözleşmeler hakkında teknik bilgi\n- Temel ve teknik piyasa analizi yeteneği\n- Risk yönetimi prensiplerine tam hakimiyet\n\nBaşvuru Şartları:\n- Finansal piyasalarda (Geleneksel veya Kripto) aktif ticaret tecrübesi\n- İleri düzey finansal İngilizce bilgisi' },
        { title: 'Mali Müşavir (SMMM)', company: 'HesapUzmanları', description: 'Görev Tanımı:\nMüşteri portföyünün aylık KDV, Muhtasar, Kurumlar Vergisi beyannamelerini hazırlamak. SGK bildirgelerini ve bordrolama süreçlerini yönetmek.\n\nAranan Nitelikler:\n- Vergi mevzuatı, TTK ve İş Kanunu mevzuatlarına güncel olarak hakim olmak\n- Zirve, Luca veya Logo muhasebe programlarını aktif kullanabilme\n- E-Defter, e-Fatura süreçleri tecrübesi\n\nBaşvuru Şartları:\n- Serbest Muhasebeci Mali Müşavir (SMMM) ruhsatına sahip olmak\n- Minimum 3 yıl aktif büro deneyimi' },
        { title: 'Yatırım Portföy Yöneticisi', company: 'InvestPro', description: 'Görev Tanımı:\nYüksek net değere sahip (HNWI) bireysel ve kurumsal müşterilerin yatırım portföylerini risk/getiri beklentilerine göre yönetmek ve çeşitlendirmek.\n\nAranan Nitelikler:\n- Sermaye piyasaları (Hisse senedi, tahvil, fon) hakkında derin bilgi\n- Güçlü müşteri ilişkileri yönetimi ve satış becerileri\n- Makroekonomik gelişmeleri okuma yeteneği\n\nBaşvuru Şartları:\n- SPK Düzey 3 ve Türev Araçlar Lisansına sahip olmak\n- Bankaların veya Aracı Kurumların ilgili bölümlerinde minimum 5 yıl tecrübe' },
        { title: 'Ticari Krediler Tahsis Uzmanı', company: 'Premium Bank', description: 'Görev Tanımı:\nKOBİ ve ticari segmentteki firmaların kredi taleplerini incelemek, finansal analizlerini yaparak kredi risk raporlarını hazırlamak ve tahsis onayı vermek.\n\nAranan Nitelikler:\n- Bilanço ve gelir tablosu analizi konusunda uzmanlık\n- İstihbarat ve kredi risk derecelendirme (rating) yöntemlerine hakimiyet\n- Analitik düşünme ve hızlı karar verebilme yeteneği\n\nBaşvuru Şartları:\n- Bankacılık sektöründe ticari krediler tahsis bölümünde en az 4 yıl tecrübe' }
      ]
    };

    const categories = Object.keys(initialJobs);
    categories.forEach((category) => {
      db.get("SELECT COUNT(*) as count FROM jobs WHERE category = ?", [category], (err, row) => {
        if (err) {
          console.error(`İş ilanları sayımı sırasında hata (${category}):`, err);
          return;
        }
        const currentCount = row ? row.count : 0;
        if (currentCount < 5) {
          const needed = 5 - currentCount;
          console.log(`[Seed] ${category} kategorisinde ${currentCount} ilan var. ${needed} yeni ilan ekleniyor...`);
          
          db.all("SELECT title FROM jobs WHERE category = ?", [category], (err, existingJobs) => {
            if (err) {
              console.error(`Mevcut ilanları sorgulama hatası (${category}):`, err);
              return;
            }
            const existingTitles = new Set(existingJobs.map(j => j.title));
            const candidates = initialJobs[category];
            let added = 0;
            
            const stmt = db.prepare(`
              INSERT INTO jobs (title, company, category, description, notified)
              VALUES (?, ?, ?, ?, 1)
            `);
            
            for (const candidate of candidates) {
              if (added >= needed) break;
              if (!existingTitles.has(candidate.title)) {
                stmt.run(candidate.title, candidate.company, category, candidate.description);
                added++;
              }
            }
            stmt.finalize();
          });
        }
      });
    });
  });
}

// Postgres query metodunu taklit eden SQLite sarmalayıcısı (Promisified Wrapper)
// SQL içindeki Postgres formatındaki $1, $2 gibi parametreleri SQLite uyumlu ? karakterine çevirir.
const query = (sql, params = []) => {
  const sqliteSql = sql.replace(/\$\d+/g, '?');
  return new Promise((resolve, reject) => {
    db.all(sqliteSql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({ rows });
      }
    });
  });
};

module.exports = {
  query,
  dbInstance: db // Gerekirse direkt sqlite3 bağlantısına erişmek için
};
